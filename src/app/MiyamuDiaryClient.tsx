"use client";

import { useMemo, useRef, useState } from "react";
import {todayISO,ymFromISO,} from "./lib/dateUtils";
import DiaryHeader from "./components/DiaryHeader";
import DiaryInputForm from "./components/DiaryInputForm";
import AddLogButton from "./components/AddLogButton";
import { useMonthlyLogs } from "./hooks/useMonthlyLogs";
import { useAddedToast } from "./hooks/useAddedToast";
import { useLogEditing } from "./hooks/useLogEditing";
import { useAddLog } from "./hooks/useAddLog";
import { calcTotalHours } from "./lib/calcTotalHours";
import DiaryHome, {type DiaryCategory,type DiaryUnit,} from "./components/DiaryHome";
import { useDiaryCards } from "./components/useDiaryCards";
import { useDiaryNavigation } from "./hooks/useDiaryNavigation";
import DiarySummaryRings from "./components/DiarySummaryRings";
import DiaryHistory from "./components/history/DiaryHistory";

const STORAGE_KEY_BASE = "miyamu_time_logs_v1";

export default function MiyamuDiaryClient() {
  const {
  cards,
  addCard,
  renameCard,
} = useDiaryCards();
  
  const {
   currentView,
   selectedCard,
   openHome,
   selectCard,
} = useDiaryNavigation();

  // 日付は自由に選択（過去月OK）
  const [dateISO, setDateISO] = useState<string>(todayISO());
  const [showHistory, setShowHistory] = useState(false);

  const ym = useMemo(() => ymFromISO(dateISO), [dateISO]);
  const storageKey = useMemo(
  () =>
    selectedCard
      ? `${STORAGE_KEY_BASE}_${selectedCard.id}_${ym}`
      : `${STORAGE_KEY_BASE}_unselected_${ym}`,
  [selectedCard, ym]
);

  const { logs, setLogs } = useMonthlyLogs(storageKey);
  
  const [hoursInput, setHoursInput] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  const {
    editingId,
    editHoursInput,
    setEditHoursInput,
    startEdit,
    cancelEdit,
    saveEdit,
    removeLog,
  } = useLogEditing({
    setLogs,
    storageKey,
  });

  const { justAdded, showAddedToast } = useAddedToast();

  // UI
  const hoursRef = useRef<HTMLInputElement | null>(null);


  /* 合計（選択中の月だけ） */
  const total = useMemo(() => calcTotalHours(logs), [logs]);
  const todayTotal = useMemo(
  () =>
    logs
      .filter((log) => log.date === dateISO)
      .reduce((sum, log) => sum + log.hours, 0),
  [logs, dateISO]
);
const {
  inputPreviewHours,
  canAdd,
  addLog,
} = useAddLog({
  dateISO,
  hoursInput,
  setHoursInput,
  setLogs,
  hoursRef,
  showAddedToast,
});

  /* この月を全消去 */
  const clearAll = () => {
    setLogs([]);
    cancelEdit();
  };

const handleAddDiaryCard = (
  category: DiaryCategory,
  name: string,
  unit: DiaryUnit
) => {
  addCard(category, name, unit);
};
if (showHistory) {
  return (
    <DiaryHistory
      onBack={() => setShowHistory(false)}
      ym={ym}
      logs={logs}
      editingId={editingId}
      editHoursInput={editHoursInput}
      onEditHoursChange={setEditHoursInput}
      onStartEdit={startEdit}
      onSaveEdit={saveEdit}
      onCancelEdit={cancelEdit}
      onRemove={removeLog}
      onClearAll={clearAll}
    />
  );
}
  if (currentView === "home") {
  return (
    <main
  style={{
    minHeight: "100vh",
    padding: 0,
    background: "#f5f6f7",
  }}
>
      <div
  style={{
    width: "100%",
    background: "transparent",
    borderRadius: 0,
    padding: 0,
    boxShadow: "none",
    border: "none",
  }}
>
        
        <DiaryHome
         cards={cards}
         onSelect={selectCard}
         onAddCard={handleAddDiaryCard}
         onRenameCard={renameCard}
     />
      </div>
    </main>
  );
}

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
      
      {/* 追加完了！アニメ */}
      <style jsx global>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          15% { opacity: 1; transform: translate(-50%, 0px); }
          100% { opacity: 0; transform: translate(-50%, -12px); }
        }
      `}</style>

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
  onClick={openHome}
  style={{
    marginBottom: 16,
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  }}
>
  ← ホームへ戻る
</button>

<DiaryHeader
  title={selectedCard?.name ?? ""}
  unit={selectedCard?.unit ?? "時間"}
  ym={ym}
/>
<DiarySummaryRings
  todayTotal={todayTotal}
  monthlyTotal={total}
  unit={selectedCard?.unit ?? "時間"}
  onTodayClick={() => setShowInput(true)}
/>
<button
  type="button"
  onClick={() => setShowHistory(true)}
>
  履歴を見る
</button>

{showInput && (
  <>
    <DiaryInputForm
      unit={selectedCard?.unit ?? "時間"}
      dateISO={dateISO}
      hoursInput={hoursInput}
      inputPreviewHours={inputPreviewHours}
      hoursRef={hoursRef}
      onDateChange={setDateISO}
      onHoursChange={setHoursInput}
    />

    <AddLogButton
      canAdd={canAdd}
      justAdded={justAdded}
      onAdd={addLog}
    />
  </>
)}
      </div>
    </main>
  );
}