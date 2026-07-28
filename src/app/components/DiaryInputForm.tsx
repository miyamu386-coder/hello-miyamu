"use client";

import { useState, type RefObject } from "react";
import { useFoodDictionary } from "../hooks/useFoodDictionary";

type Props = {
  cardName: string;
  unit: string;
  dateISO: string;
  hoursInput: string;
  inputPreviewHours: number;
  hoursRef: RefObject<HTMLInputElement | null>;
  onDateChange: (value: string) => void;
  onHoursChange: (value: string) => void;
};

export default function DiaryInputForm({
  cardName,
  unit,
  dateISO,
  hoursInput,
  inputPreviewHours,
  hoursRef,
  onDateChange,
  onHoursChange,
}: Props) {
  const isFoodCard =
    cardName === "食事量" &&
    unit === "kcal";

const { foods, addFood } = useFoodDictionary();

const [foodName, setFoodName] = useState("");
const [foodKcal, setFoodKcal] = useState("");

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
      食品辞書
    </div>

    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <input
        type="text"
        value={foodName}
        placeholder="食品名"
        onChange={(event) => setFoodName(event.target.value)}
        style={{
          minWidth: 160,
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #cad8cf",
        }}
      />

      <input
        type="number"
        inputMode="numeric"
        value={foodKcal}
        placeholder="kcal"
        onChange={(event) => setFoodKcal(event.target.value)}
        style={{
          width: 100,
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #cad8cf",
        }}
      />

      <button
        type="button"
        onClick={() => {
          const kcal = Number(foodKcal);

          if (!foodName.trim() || !Number.isFinite(kcal) || kcal < 0) {
            window.alert("食品名とkcalを正しく入力してください");
            return;
          }

          addFood(foodName, kcal);
          setFoodName("");
          setFoodKcal("");
        }}
        style={{
          padding: "10px 14px",
          border: "none",
          borderRadius: 10,
          background: "#4f7c5b",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        辞書に追加
      </button>
    </div>

    {foods.length > 0 && (
      <div
        style={{
          marginTop: 14,
          display: "grid",
          gap: 8,
        }}
      >
        {foods.map((food) => (
          <button
            key={food.id}
            type="button"
            onClick={() => onHoursChange(String(food.kcal))}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #dce7df",
              background: "#f7faf8",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {food.name}：{food.kcal} kcal
          </button>
        ))}
      </div>
    )}
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