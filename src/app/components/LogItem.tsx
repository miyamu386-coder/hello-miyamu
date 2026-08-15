import type { Log } from "../types";
import { toSlashDate } from "../lib/dateUtils";
import { normalizeNumberString } from "../lib/numberUtils";
import type { MealType } from "./DiaryInputForm";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


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
  editMealType: MealType;
onEditMealTypeChange: (value: MealType) => void;
};

export default function LogItem({
  log,
  unit,
  isEditing,
  editHoursInput,
  editMealType,
  onEditHoursChange,
  onEditMealTypeChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
}: Props) {
const mealTypeLabel = {
  breakfast: "🌅 朝食",
  lunch: "🍱 昼食",
  dinner: "🌙 夕食",
  snack: "🍪 間食",
} as const;
const isTrainingLog = Boolean(log.trainingId);

const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
} = useSortable({
  id: log.id,
});

  return (
  <div
    ref={setNodeRef}
    style={{
  border: "2px solid #333",
  borderRadius: 12,
  padding: 14,
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 10,
  alignItems: "center",
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.6 : 1,
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
          <button
  type="button"
  {...attributes}
  {...listeners}
  aria-label="並び替え"
  style={{
    border: "none",
    background: "transparent",
    cursor: "grab",
    fontSize: 20,
    padding: 0,
    touchAction: "none",
  }}
>
  ≡
</button>
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
    {isEditing ? (
  <select
    value={editMealType}
    onChange={(event) =>
      onEditMealTypeChange(event.target.value as MealType)
    }
    style={{
      marginBottom: 8,
      padding: "8px 10px",
      borderRadius: 8,
      border: "1px solid #cad8cf",
      background: "#fff",
      fontSize: 15,
      fontWeight: 700,
      color: "#35453b",
    }}
  >
    <option value="breakfast">🌅 朝食</option>
    <option value="lunch">🍱 昼食</option>
    <option value="dinner">🌙 夕食</option>
    <option value="snack">🍪 間食</option>
  </select>
) : (
  log.mealType && (
    <div
      style={{
        fontWeight: 700,
        marginBottom: 6,
        color: "#4f7c5b",
      }}
    >
      {mealTypeLabel[log.mealType]}
    </div>
  )
)}

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
  {isTrainingLog ? (
    <>
      <b>
        {Number.isInteger(log.hours)
          ? log.hours
          : log.hours.toFixed(1)}
      </b>{" "}
      {log.trainingId === "plank" ? "秒" : "回"}
      {" × "}
      <b>{log.trainingSets ?? 1}</b> セット
    </>
  ) : (
    <>
      <b>
        {unit === "時間"
          ? log.hours.toFixed(1)
          : Number.isInteger(log.hours)
            ? log.hours
            : log.hours.toFixed(1)}
      </b>{" "}
      {unit}
    </>
  )}
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