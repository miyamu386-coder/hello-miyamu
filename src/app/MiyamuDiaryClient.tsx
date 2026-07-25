"use client";

import { useMemo, useRef, useState } from "react";
import {todayISO,ymFromISO,} from "./lib/dateUtils";
import DiaryHeader from "./components/DiaryHeader";
import DiaryInputForm from "./components/DiaryInputForm";
import AddLogButton from "./components/AddLogButton";
import LogList from "./components/LogList";
import { useBlink } from "./hooks/useBlink";
import { useMonthlyLogs } from "./hooks/useMonthlyLogs";
import { useAddedToast } from "./hooks/useAddedToast";
import { useLogEditing } from "./hooks/useLogEditing";
import { useAddLog } from "./hooks/useAddLog";
import { calcTotalHours } from "./lib/calcTotalHours";


const STORAGE_KEY_BASE = "miyamu_time_logs_v1";

export default function MiyamuDiaryClient() {
  // 日付は自由に選択（過去月OK）
  const [dateISO, setDateISO] = useState<string>(todayISO());

  const ym = useMemo(() => ymFromISO(dateISO), [dateISO]);
  const storageKey = useMemo(() => `${STORAGE_KEY_BASE}_${ym}`, [ym]);

  const { logs, setLogs } = useMonthlyLogs(storageKey);
  
  const [hoursInput, setHoursInput] = useState<string>("");
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

  const isBlink = useBlink();

 const { justAdded, showAddedToast } = useAddedToast();

  // UI
  const hoursRef = useRef<HTMLInputElement | null>(null);
  const [isMofuHover, setIsMofuHover] = useState(false);


  /* 合計（選択中の月だけ） */
const total = useMemo(() => calcTotalHours(logs), [logs]);

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

  const mofuButtonImg = isBlink ? "/mofu-blink.png" : "/mofu-add.jpg";

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
        <DiaryHeader ym={ym} total={total} />
       <DiaryInputForm
  dateISO={dateISO}
  hoursInput={hoursInput}
  inputPreviewHours={inputPreviewHours}
  hoursRef={hoursRef}
  onDateChange={setDateISO}
  onHoursChange={setHoursInput}
/>

<AddLogButton
  canAdd={canAdd}
  mofuButtonImg={mofuButtonImg}
  isMofuHover={isMofuHover}
  justAdded={justAdded}
  onAdd={addLog}
  onMouseEnter={() => setIsMofuHover(true)}
  onMouseLeave={() => setIsMofuHover(false)}
/>

<LogList
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
      </div>
    </main>
  );
}