import type { Log } from "../types";
import LogItem from "./LogItem";
import { monthLabel } from "../lib/dateUtils";
import type { MealType } from "./DiaryInputForm";
import type { Dispatch, SetStateAction } from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

type Props = {
  ym: string;
  logs: Log[];
  setLogs: Dispatch<SetStateAction<Log[]>>;
  cardName: string;
  unit: string;
  editingId: string | null;
  editHoursInput: string;
  onEditHoursChange: (value: string) => void;
  onStartEdit: (log: Log) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  editMealType: MealType;
  onEditMealTypeChange: (value: MealType) => void;
};

export default function LogList({
  ym,
  logs,
  setLogs,
  cardName,
  unit,
  editingId,
  editHoursInput,
  editMealType,
  onEditHoursChange,
  onEditMealTypeChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onClearAll,
}: Props) {
  const mealTypeOrder = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  snack: 3,
} as const;

const sortedLogs = [...logs].sort((a, b) => {

  const dateCompare = b.date.localeCompare(a.date);

  if (dateCompare !== 0) {
    return dateCompare;
  }

  const aSortOrder = a.sortOrder;
const bSortOrder = b.sortOrder;

if (
  aSortOrder !== undefined ||
  bSortOrder !== undefined
) {
  return (
    (aSortOrder ?? Number.MAX_SAFE_INTEGER) -
    (bSortOrder ?? Number.MAX_SAFE_INTEGER)
  );
}

const aMealOrder = a.mealType
  ? mealTypeOrder[a.mealType]
  : 99;

const bMealOrder = b.mealType
  ? mealTypeOrder[b.mealType]
  : 99;

return aMealOrder - bMealOrder;
});
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;

  if (!over || active.id === over.id) {
    return;
  }

  const oldIndex = sortedLogs.findIndex(
    (log) => log.id === active.id
  );

  const newIndex = sortedLogs.findIndex(
    (log) => log.id === over.id
  );

  const moved = arrayMove(
    sortedLogs,
    oldIndex,
    newIndex
  ).map((log, index) => ({
    ...log,
    sortOrder: index,
  }));

  setLogs(moved);
};

  return (
    <>
      <div style={{ marginTop: 28, fontSize: 18, fontWeight: 800 }}>
        記録一覧（{monthLabel(ym)}）
      </div>

      <DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={sortedLogs.map((log) => log.id)}
    strategy={verticalListSortingStrategy}
  >
    <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
      {logs.length === 0 ? (
        <div style={{ color: "#666" }}>まだ記録がありません</div>
      ) : (
        sortedLogs.map((log) => (
          <LogItem
            key={log.id}
            log={log}
            unit={unit}
            isEditing={editingId === log.id}
            editHoursInput={editHoursInput}
            editMealType={editMealType}
            onEditHoursChange={onEditHoursChange}
            onEditMealTypeChange={onEditMealTypeChange}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  </SortableContext>
</DndContext>

      <button
        type="button"
        onClick={onClearAll}
        style={{
          width: "100%",
          marginTop: 18,
          padding: "14px 16px",
          fontSize: 18,
          borderRadius: 10,
          border: "2px solid #333",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 800,
        }}
      >
        この月の{cardName}記録を全部消去
      </button>
    </>
  );
}