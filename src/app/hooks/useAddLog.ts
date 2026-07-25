import { useMemo } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Log } from "../types";
import { parseHours } from "../lib/numberUtils";
import { uid } from "../lib/idUtils";

type UseAddLogProps = {
  dateISO: string;
  hoursInput: string;
  setHoursInput: Dispatch<SetStateAction<string>>;
  setLogs: Dispatch<SetStateAction<Log[]>>;
  hoursRef: RefObject<HTMLInputElement | null>;
  showAddedToast: () => void;
};

export function useAddLog({
  dateISO,
  hoursInput,
  setHoursInput,
  setLogs,
  hoursRef,
  showAddedToast,
}: UseAddLogProps) {
  const inputPreviewHours = useMemo(() => {
    if (!hoursInput.trim()) return 0;

    const hours = parseHours(hoursInput);

    return Number.isFinite(hours) ? hours : 0;
  }, [hoursInput]);

  const canAdd = useMemo(() => {
    const hours = parseHours(hoursInput);

    return Boolean(dateISO) && Number.isFinite(hours) && hours > 0;
  }, [hoursInput, dateISO]);

  const addLog = () => {
    const hours = parseHours(hoursInput);

    if (!Number.isFinite(hours) || hours <= 0) return;

    const nextLog: Log = {
      id: uid(),
      date: dateISO,
      hours,
    };

    setLogs((prev) => {
      const merged = [nextLog, ...prev];

      merged.sort((a, b) =>
        a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
      );

      return merged;
    });

    setHoursInput("");
    requestAnimationFrame(() => hoursRef.current?.focus());

    showAddedToast();
  };

  return {
    inputPreviewHours,
    canAdd,
    addLog,
  };
}