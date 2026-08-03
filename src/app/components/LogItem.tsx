import type { Log } from "../types";
import { toSlashDate } from "../lib/dateUtils";
import { normalizeNumberString } from "../lib/numberUtils";

type Props = {
  log: Log;
  unit: string;
  isEditing: boolean;
  editHoursInput: string;
  onEditHoursChange: (value: string) => void;
  onStartEdit: (log: Log) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onRemove: (id: string) => void;
};

export default function LogItem({
  log,
  unit,
  isEditing,
  editHoursInput,
  onEditHoursChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
}: Props) {
  return (
    <div
      style={{
        border: "2px solid #333",
        borderRadius: 12,
        padding: 14,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 10,
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span aria-hidden="true">📅</span>
          <b>{toSlashDate(log.date)}</b>
        </div>
         {log.mealText && (
  <div
    style={{
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 10,
      background: "#f7faf8",
      color: "#35453b",
      fontSize: 16,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
    }}
  >
    {log.mealText}
  </div>
)}
        <div style={{ marginTop: 8, fontSize: 18, color: "#333" }}>
          ・{" "}
          {isEditing ? (
            <input
              value={editHoursInput}
              onChange={(e) =>
                onEditHoursChange(normalizeNumberString(e.target.value))
              }
              inputMode="decimal"
              style={{
                width: 140,
                padding: "6px 8px",
                fontSize: 18,
                borderRadius: 8,
                border: "2px solid #333",
              }}
            />
          ) : (
            <span>
  <b>
    {unit === "時間"
      ? log.hours.toFixed(1)
      : Number.isInteger(log.hours)
        ? log.hours
        : log.hours.toFixed(1)}
  </b>{" "}
  {unit}
</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => onSaveEdit(log.id)}
              style={{
                border: "none",
                background: "#1f66ff",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              保存
            </button>

            <button
              type="button"
              onClick={onCancelEdit}
              style={{
                border: "2px solid #333",
                background: "#fff",
                color: "#333",
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              キャンセル
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onStartEdit(log)}
              style={{
                border: "none",
                background: "transparent",
                color: "#1f66ff",
                cursor: "pointer",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              修正
            </button>

            <button
              type="button"
              onClick={() => onRemove(log.id)}
              style={{
                border: "none",
                background: "transparent",
                color: "#ff2d2d",
                cursor: "pointer",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              消去
            </button>
          </>
        )}
      </div>
    </div>
  );
}