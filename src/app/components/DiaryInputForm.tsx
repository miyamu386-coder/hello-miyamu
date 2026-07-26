import type { RefObject } from "react";
import { normalizeNumberString } from "../lib/numberUtils";

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
  const inputLabel =
    unit === "時間"
      ? "作業時間（時間）"
      : unit === "分"
        ? "時間（分）"
        : "回数";

  const placeholder =
    unit === "時間"
      ? "例：5 / 2.5"
      : unit === "分"
        ? "例：320"
        : "例：10";

  const inputMode = unit === "時間" ? "decimal" : "numeric";

  return (
    <>
      <label
        style={{
          display: "block",
          fontSize: 16,
          marginTop: 18,
          marginBottom: 10,
        }}
      >
        日付
      </label>

      <input
        type="date"
        value={dateISO}
        onChange={(e) => onDateChange(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: 22,
          borderRadius: 10,
          border: "2px solid #333",
          outline: "none",
        }}
      />

      <label
        style={{
          display: "block",
          fontSize: 16,
          marginTop: 18,
          marginBottom: 10,
        }}
      >
        {inputLabel}
      </label>

      <input
        ref={hoursRef}
        value={hoursInput}
        onChange={(e) =>
          onHoursChange(normalizeNumberString(e.target.value))
        }
        placeholder={placeholder}
        inputMode={inputMode}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: 22,
          borderRadius: 10,
          border: "2px solid #333",
          outline: "none",
        }}
      />

      <div style={{ marginTop: 12, color: "#666", fontSize: 18 }}>
        入力中：{inputPreviewHours} {unit}
      </div>
    </>
  );
}