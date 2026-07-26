"use client";

import type { RefObject } from "react";

type Props = {
  unit: string;
  dateISO: string;
  hoursInput: string;
  inputPreviewHours: number;
  hoursRef: RefObject<HTMLInputElement | null>;
  onDateChange: (value: string) => void;
  onHoursChange: (value: string) => void;
};

export default function DiaryInputForm({
  unit,
  dateISO,
  hoursInput,
  inputPreviewHours,
  hoursRef,
  onDateChange,
  onHoursChange,
}: Props) {
  const placeholder =
    unit === "時間"
      ? "例：2.5"
      : unit === "分"
        ? "例：320"
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
          inputMode={unit === "時間" ? "decimal" : "numeric"}
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