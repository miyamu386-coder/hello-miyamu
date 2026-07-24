"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Log } from "./types";
import {todayISO,ymFromISO,} from "./lib/dateUtils";
import { parseHours } from "./lib/numberUtils";
import { uid } from "./lib/idUtils";
import DiaryHeader from "./components/DiaryHeader";
import DiaryInputForm from "./components/DiaryInputForm";
import AddLogButton from "./components/AddLogButton";
import LogList from "./components/LogList";
import { useBlink } from "./hooks/useBlink";
import { useMonthlyLogs } from "./hooks/useMonthlyLogs";
import { useAddedToast } from "./hooks/useAddedToast";


const STORAGE_KEY_BASE = "miyamu_time_logs_v1";

export default function MiyamuDiaryClient() {
  // 日付は自由に選択（過去月OK）
  const [dateISO, setDateISO] = useState<string>(todayISO());

  const ym = useMemo(() => ymFromISO(dateISO), [dateISO]);
  const storageKey = useMemo(() => `${STORAGE_KEY_BASE}_${ym}`, [ym]);

  const { logs, setLogs } = useMonthlyLogs(storageKey);
  
  const [hoursInput, setHoursInput] = useState<string>("");


  // 編集
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHoursInput, setEditHoursInput] = useState<string>("");

  const isBlink = useBlink();

 const { justAdded, showAddedToast } = useAddedToast();

  // UI
  const hoursRef = useRef<HTMLInputElement | null>(null);
  const [isMofuHover, setIsMofuHover] = useState(false);

/* 月が変わったら編集中の状態を解除 */
useEffect(() => {
  setEditingId(null);
  setEditHoursInput("");
}, [storageKey]);

  /* 合計（選択中の月だけ） */
  const total = useMemo(() => logs.reduce((sum, l) => sum + l.hours, 0), [logs]);

  /* 入力中プレビュー */
  const inputPreviewHours = useMemo(() => {
    if (!hoursInput.trim()) return 0;
    const n = parseHours(hoursInput);
    return Number.isFinite(n) ? n : 0;
  }, [hoursInput]);

  /* 追加できるか */
  const canAdd = useMemo(() => {
    const h = parseHours(hoursInput);
    return !!dateISO && Number.isFinite(h) && h > 0;
  }, [hoursInput, dateISO]);


  /* 追加 */
  const addLog = () => {
    const h = parseHours(hoursInput);
    if (!Number.isFinite(h) || h <= 0) return;

    // dateISO の月に保存される（storageKeyがym由来なので）
    const next: Log = { id: uid(), date: dateISO, hours: h };

    setLogs((prev) => {
      const merged = [next, ...prev];
      merged.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      return merged;
    });

    setHoursInput("");
    requestAnimationFrame(() => hoursRef.current?.focus());

        showAddedToast();
  };

  /* 編集開始 */
  const startEdit = (log: Log) => {
    setEditingId(log.id);
    setEditHoursInput(String(log.hours));
  };

  /* 編集キャンセル */
  const cancelEdit = () => {
    setEditingId(null);
    setEditHoursInput("");
  };

  /* 編集保存 */
  const saveEdit = (id: string) => {
    const n = parseHours(editHoursInput);
    if (!Number.isFinite(n) || n <= 0) return;

    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, hours: n } : l)));
    cancelEdit();
  };

  /* 削除 */
  const removeLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    if (editingId === id) cancelEdit();
  };

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