import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Log } from "../types";

type UseMonthlyLogsResult = {
  logs: Log[];
  setLogs: Dispatch<SetStateAction<Log[]>>;
};

export function useMonthlyLogs(storageKey: string): UseMonthlyLogsResult {
  const [logs, setLogs] = useState<Log[]>([]);
  const hasLoadedForKeyRef = useRef<string | null>(null);

  useEffect(() => {
    hasLoadedForKeyRef.current = null;

    try {
      const raw = localStorage.getItem(storageKey);

      if (!raw) {
        setLogs([]);
        return;
      }

      const parsed = JSON.parse(raw) as unknown;

      if (!Array.isArray(parsed)) {
        setLogs([]);
        return;
      }

      setLogs(parsed as Log[]);
    } catch {
      setLogs([]);
    } finally {
      hasLoadedForKeyRef.current = storageKey;
    }
  }, [storageKey]);

  useEffect(() => {
    if (hasLoadedForKeyRef.current !== storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(logs));
    } catch {
      // 保存できない場合は何もしない
    }
  }, [logs, storageKey]);

  return {
    logs,
    setLogs,
  };
}