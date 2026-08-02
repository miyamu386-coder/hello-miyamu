import type { Log } from "../../types";
import LogList from "../LogList";

type Props = {
  onBack: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
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

export default function DiaryHistory({
  onBack,
  onPrevMonth,
  onNextMonth,
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
  return (
  <main
    style={{
      minHeight: "100vh",
      padding: 24,
      display: "flex",
      justifyContent: "center",
      background: "#f5f6f7",
    }}
  >
    <div
      style={{
        width: "min(720px, 100%)",
        background: "#fff",
        borderRadius: 16,
        padding: 28,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          borderRadius: 10,
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        ← 戻る
      </button>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  }}
>
  <button type="button" onClick={onPrevMonth}>
    ◀ 前月
  </button>

  <strong>{ym}</strong>

  <button type="button" onClick={onNextMonth}>
    次月 ▶
  </button>
</div>

      <h2
  style={{
    margin: "0 0 20px",
    fontSize: 24,
    fontWeight: 700,
  }}
>
  {cardName} の履歴
</h2>

      <LogList
  ym={ym}
  logs={logs}
  cardName={cardName}
  unit={unit}
  editingId={editingId}
  editHoursInput={editHoursInput}
  onEditHoursChange={onEditHoursChange}
  onStartEdit={onStartEdit}
  onSaveEdit={onSaveEdit}
  onCancelEdit={onCancelEdit}
  onRemove={onRemove}
  onClearAll={onClearAll}
/>
    </div>
  </main>
);
}