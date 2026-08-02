import type { Log } from "../types";
import LogItem from "./LogItem";
import { monthLabel } from "../lib/dateUtils";

type Props = {
  ym: string;
  logs: Log[];
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
};

export default function LogList({
  ym,
  logs,
  cardName,
  unit,
  editingId,
  editHoursInput,
  onEditHoursChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onClearAll,
}: Props) {
  const sortedLogs = [...logs].sort((a, b) =>
  b.date.localeCompare(a.date)
);
  return (
    <>
      <div style={{ marginTop: 28, fontSize: 18, fontWeight: 800 }}>
        記録一覧（{monthLabel(ym)}）
      </div>

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
              onEditHoursChange={onEditHoursChange}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

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