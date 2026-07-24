import type { RefObject } from "react";
import { normalizeNumberString } from "../lib/numberUtils";

type Props = {
  dateISO: string;
  hoursInput: string;
  inputPreviewHours: number;
  hoursRef: RefObject<HTMLInputElement | null>;
  onDateChange: (value: string) => void;
  onHoursChange: (value: string) => void;
};

export default function DiaryInputForm({
  dateISO,
  hoursInput,
  inputPreviewHours,
  hoursRef,
  onDateChange,
  onHoursChange,
}: Props) {
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
        作業時間（時間）
      </label>

      <input
        ref={hoursRef}
        value={hoursInput}
        onChange={(e) =>
          onHoursChange(normalizeNumberString(e.target.value))
        }
        placeholder="例：5 / 2.5"
        inputMode="decimal"
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
        入力中：{inputPreviewHours} 時間
      </div>
    </>
  );
}