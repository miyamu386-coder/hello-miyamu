import type { Log } from "../../types";
import LogList from "../LogList";

type Props = {
  onBack: () => void;
  ym: string;
  logs: Log[];
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
  ym,
  logs,
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

      <LogList
        ym={ym}
        logs={logs}
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