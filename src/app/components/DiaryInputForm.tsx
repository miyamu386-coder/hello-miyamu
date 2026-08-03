"use client";

import type { RefObject } from "react";
import { useFoodDictionary } from "../hooks/useFoodDictionary";

type Props = {
  cardName: string;
  unit: string;
  dateISO: string;
  hoursInput: string;
  mealText: string;
  inputPreviewHours: number;
  hoursRef: RefObject<HTMLInputElement | null>;
  onDateChange: (value: string) => void;
  onHoursChange: (value: string) => void;
  onMealTextChange: (value: string) => void;
};

export default function DiaryInputForm({
  cardName,
  unit,
  dateISO,
  hoursInput,
  mealText,
  inputPreviewHours,
  hoursRef,
  onDateChange,
  onHoursChange,
  onMealTextChange,
}: Props) {
  const isFoodCard =
    cardName === "食事量" &&
    unit === "kcal";

const { foods } = useFoodDictionary();

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
    window.alert("食品辞書に一致する食品が見つかりませんでした");
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