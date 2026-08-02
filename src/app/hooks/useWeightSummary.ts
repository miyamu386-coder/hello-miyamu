import { useMemo } from "react";
import type { Log } from "../types";

type Props = {
  logs: Log[];
  dateISO: string;
  cardId: string;
  storageKeyBase: string;
};

type WeightSummary = {
  todayWeight: number | null;
  previousWeight: number | null;
  weightLogs: Log[];
};

export function useWeightSummary({
  logs,
  dateISO,
  cardId,
  storageKeyBase,
}: Props): WeightSummary {
  const todayWeight = useMemo(() => {
    const todayLogs = logs
      .filter((log) => log.date === dateISO)
      .sort((a, b) => b.id.localeCompare(a.id));

    return todayLogs[0]?.hours ?? null;
  }, [logs, dateISO]);

  const weightLogs = useMemo(() => {
  if (!cardId) {
    return [];
  }

  const prefix = `${storageKeyBase}_${cardId}_`;
  const allLogs: Log[] = [];

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (!key?.startsWith(prefix)) {
        continue;
      }

      const raw = localStorage.getItem(key);

      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(raw) as unknown;

      if (Array.isArray(parsed)) {
        allLogs.push(...(parsed as Log[]));
      }
    }
  } catch {
    return [];
  }

  return allLogs.sort((a, b) => a.date.localeCompare(b.date));
}, [cardId, logs, storageKeyBase]);

const previousWeight = useMemo(() => {
  const previousLogs = weightLogs
    .filter((log) => log.date < dateISO)
    .sort((a, b) => b.date.localeCompare(a.date));

  return previousLogs[0]?.hours ?? null;
}, [dateISO, weightLogs]);

return {
  todayWeight,
  previousWeight,
  weightLogs,
};
}