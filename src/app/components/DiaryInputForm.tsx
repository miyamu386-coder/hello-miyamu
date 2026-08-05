"use client";

import { useState, type RefObject } from "react";
import { useFoodDictionary } from "../hooks/useFoodDictionary";
export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

type Props = {
  cardName: string;
  unit: string;
  dateISO: string;
  hoursInput: string;
  mealText: string;
  mealType: MealType;
  inputPreviewHours: number;
  hoursRef: RefObject<HTMLInputElement | null>;
  onDateChange: (value: string) => void;
  onHoursChange: (value: string) => void;
  onMealTextChange: (value: string) => void;
  onMealTypeChange: (value: MealType) => void;
};

export default function DiaryInputForm({
  cardName,
  unit,
  dateISO,
  hoursInput,
  mealText,
  mealType,
  inputPreviewHours,
  hoursRef,
  onDateChange,
  onHoursChange,
  onMealTextChange,
  onMealTypeChange,
}: Props) {
  const isFoodCard =
    cardName === "食事量" &&
    unit === "kcal";

const { foods, addFood } = useFoodDictionary();

const [newFoodName, setNewFoodName] = useState("");
const [newFoodKcal, setNewFoodKcal] = useState("");

const normalizeText = (text: string) =>
  text
    .replace(/[０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    )
    .replace(/\s+/g, "")
    .replace(/納豆卵かけご飯|納豆たまごかけごはん/gi,"ご飯納豆卵")
    .replace(/卵かけご飯|たまごかけごはん|tkg/gi, "ご飯卵")
    .replace(/納豆ご飯|納豆ごはん/g, "ご飯納豆")
    .replace(/[　]/g, "")
    .replace(/ごはん/g, "ご飯")
    .replace(/白米/g, "ご飯")
    .replace(/たまご/g, "卵")
    .replace(/玉子/g, "卵")
    .replace(/鶏胸/g, "鶏むね")
    .replace(/鳥/g, "鶏")
    .toLowerCase();
const calculateMealKcal = () => {
  const normalizedMealText = normalizeText(mealText);

  const matchedFoods = foods.filter((food) => {
  const normalizedFoodName = normalizeText(food.name);
  const normalizedBaseName = normalizeText(food.baseName);

  const hasSpecificAmount = foods.some(
    (candidate) =>
      candidate.baseName === food.baseName &&
      normalizedMealText.includes(normalizeText(candidate.name))
  );

  const hasMoreSpecificMenu = foods.some((candidate) => {
    if (candidate.id === food.id) {
      return false;
    }

    const normalizedCandidateName = normalizeText(candidate.name);

    return (
      normalizedCandidateName.length > normalizedFoodName.length &&
      normalizedCandidateName.includes(normalizedFoodName) &&
      normalizedMealText.includes(normalizedCandidateName)
    );
  });

  if (hasMoreSpecificMenu) {
    return false;
  }

  if (hasSpecificAmount) {
    return normalizedMealText.includes(normalizedFoodName);
  }

  return (
    food.isDefault &&
    normalizedMealText.includes(normalizedBaseName)
  );
});

  const totalKcal = matchedFoods.reduce((total, food) => {
  const normalizedFoodName = normalizeText(food.name);
  const normalizedBaseName = normalizeText(food.baseName);

  const isSpecificAmount =
    normalizedMealText.includes(normalizedFoodName);

  if (isSpecificAmount) {
    return total + food.kcal;
  }

  const quantityPattern = new RegExp(
    `${normalizedBaseName}(\\d+)(個|本|枚|パック|玉)`
  );

  const quantityMatch = normalizedMealText.match(quantityPattern);

  const quantity = quantityMatch
    ? Number(quantityMatch[1])
    : 1;

  return total + food.kcal * quantity;
}, 0);

  if (matchedFoods.length === 0) {
  window.alert(
    `『${mealText.trim()}』は辞書登録されていません。\n下の「食品辞書に追加」から登録してください。`
  );
  return;
}

  onHoursChange(String(totalKcal));
};

const placeholder =
  unit === "時間"
    ? "例：2.5"
    : unit === "分"
      ? "例：320"
      : unit === "kcal"
        ? "例：650"
        : unit === "kg"
          ? "例：58.2"
          : "例：10";

  return (
    <div
      style={{
        marginTop: 12,
        padding: 20,
        borderRadius: 20,
        background: "#f7faf8",
        border: "1px solid #e2ebe5",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: 15,
          fontWeight: 700,
          color: "#78817c",
          marginBottom: 14,
        }}
      >
        今日の記録
      </div>

{isFoodCard && (
  <div
    style={{
      marginBottom: 20,
      padding: 16,
      borderRadius: 16,
      background: "#fff",
      border: "1px solid #dce7df",
    }}
  >
    <div
      style={{
        marginBottom: 12,
        fontWeight: 800,
        textAlign: "center",
      }}
    >
      食事内容
    </div>
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
    marginBottom: 12,
  }}
>
  {[
    { value: "breakfast", label: "朝食" },
    { value: "lunch", label: "昼食" },
    { value: "dinner", label: "夕食" },
    { value: "snack", label: "間食" },
  ].map((option) => {
    const selected = mealType === option.value;

    return (
      <button
        key={option.value}
        type="button"
        onClick={() =>
          onMealTypeChange(option.value as MealType)
        }
        style={{
          padding: "10px 4px",
          borderRadius: 10,
          border: selected
            ? "1px solid #4f7c5b"
            : "1px solid #cad8cf",
          background: selected ? "#e9f2ec" : "#fff",
          color: selected ? "#3f6849" : "#78817c",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {option.label}
      </button>
    );
  })}
</div>
    <textarea
  value={mealText}
  placeholder="例：ご飯 150g、納豆 1パック、卵 1個"
  onChange={(event) =>
  onMealTextChange(event.target.value)
}
  rows={4}
  style={{
    width: "100%",
    boxSizing: "border-box",
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #cad8cf",
    background: "#fff",
    resize: "vertical",
    fontSize: 16,
  }}
/>
<button
  type="button"
  onClick={calculateMealKcal}
  style={{
    width: "100%",
    marginBottom: 12,
    padding: "12px 16px",
    border: "none",
    borderRadius: 12,
    background: "#4f7c5b",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  カロリーを計算
</button>
<details
  style={{
    marginTop: 4,
    paddingTop: 12,
    borderTop: "1px solid #e2ebe5",
  }}
>
  <summary
    style={{
      cursor: "pointer",
      color: "#4f7c5b",
      fontSize: 14,
      fontWeight: 700,
      textAlign: "center",
    }}
  >
    食品辞書に追加
  </summary>

  <div
    style={{
      marginTop: 12,
      display: "grid",
      gap: 10,
    }}
  >
    <input
      type="text"
      value={newFoodName}
      placeholder="例：オリジン のり弁 大盛"
      onChange={(event) => setNewFoodName(event.target.value)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        borderRadius: 10,
        border: "1px solid #cad8cf",
        background: "#fff",
        fontSize: 16,
      }}
    />

    <input
      type="number"
      inputMode="numeric"
      value={newFoodKcal}
      placeholder="例：920"
      onChange={(event) => setNewFoodKcal(event.target.value)}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        borderRadius: 10,
        border: "1px solid #cad8cf",
        background: "#fff",
        fontSize: 16,
      }}
    />

    <button
      type="button"
      onClick={() => {
        const kcal = Number(newFoodKcal);

        if (!newFoodName.trim()) {
          window.alert("食品名を入力してください");
          return;
        }

        if (!Number.isFinite(kcal) || kcal <= 0) {
          window.alert("1以上のカロリーを入力してください");
          return;
        }

        addFood(newFoodName, kcal);
        setNewFoodName("");
        setNewFoodKcal("");

        window.alert("食品辞書に追加しました");
      }}
      style={{
        width: "100%",
        padding: "11px 16px",
        border: "1px solid #4f7c5b",
        borderRadius: 10,
        background: "#fff",
        color: "#4f7c5b",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      辞書に登録
    </button>
  </div>
</details>
  </div>
)}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <input
          ref={hoursRef}
          type="number"
          inputMode={unit === "時間" || unit === "kg"
            ? "decimal"
            : "numeric"}
          value={hoursInput}
          placeholder={placeholder}
          onChange={(event) => onHoursChange(event.target.value)}
          style={{
            width: 180,
            height: 64,
            borderRadius: 18,
            border: "1px solid #cad8cf",
            background: "#fff",
            padding: "0 18px",
            textAlign: "center",
            fontSize: 28,
            fontWeight: 800,
            outline: "none",
          }}
        />

        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#56605a",
          }}
        >
          {unit}
        </span>
      </div>

      {inputPreviewHours > 0 && (
        <div
          style={{
            marginTop: 12,
            textAlign: "center",
            fontSize: 14,
            color: "#78817c",
          }}
        >
          入力中：{inputPreviewHours} {unit}
        </div>
      )}

      <details
        style={{
          marginTop: 16,
          textAlign: "center",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            color: "#78817c",
            fontSize: 14,
          }}
        >
          日付を変更
        </summary>

        <input
          type="date"
          value={dateISO}
          onChange={(event) => onDateChange(event.target.value)}
          style={{
            marginTop: 10,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #cad8cf",
            background: "#fff",
          }}
        />
      </details>
    </div>
  );
}