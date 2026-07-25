import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Log } from "../types";
import { parseHours } from "../lib/numberUtils";

type UseLogEditingProps = {
  setLogs: Dispatch<SetStateAction<Log[]>>;
  storageKey: string;
};

export function useLogEditing({
  setLogs,
  storageKey,
}: UseLogEditingProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHoursInput, setEditHoursInput] = useState("");

  /* 月が変わったら編集中の状態を解除 */
  useEffect(() => {
    setEditingId(null);
    setEditHoursInput("");
  }, [storageKey]);

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
    const hours = parseHours(editHoursInput);

    if (!Number.isFinite(hours) || hours <= 0) {
      return;
    }

    setLogs((prev) =>
      prev.map((log) =>
        log.id === id
          ? {
              ...log,
              hours,
            }
          : log,
      ),
    );

    cancelEdit();
  };

  /* 削除 */
  const removeLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));

    if (editingId === id) {
      cancelEdit();
    }
  };

  return {
    editingId,
    editHoursInput,
    setEditHoursInput,
    startEdit,
    cancelEdit,
    saveEdit,
    removeLog,
  };
}