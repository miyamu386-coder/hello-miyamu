import { useMemo } from "react";
import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from "react";
import type { Log } from "../types";
import { parseHours } from "../lib/numberUtils";
import { uid } from "../lib/idUtils";
import type { MealType } from "../components/DiaryInputForm";

type UseAddLogProps = {
  logs: Log[];
  dateISO: string;
  hoursInput: string;
  setHoursInput: Dispatch<SetStateAction<string>>;
  setLogs: Dispatch<SetStateAction<Log[]>>;
  hoursRef: RefObject<HTMLInputElement | null>;
  mealText?: string;
  setMealText?: Dispatch<SetStateAction<string>>;
  showAddedToast: () => void;
  mealType?: MealType;
};

export function useAddLog({
  logs,
  dateISO,
  hoursInput,
  setHoursInput,
  setLogs,
  hoursRef,
  mealText,
  setMealText,
  showAddedToast,
  mealType,
}: UseAddLogProps) {
  const inputPreviewHours = useMemo(() => {
    if (!hoursInput.trim()) {
      return 0;
    }

    const hours = parseHours(hoursInput);

    return Number.isFinite(hours) ? hours : 0;
  }, [hoursInput]);

  const canAdd = useMemo(() => {
    const hours = parseHours(hoursInput);

    return (
      Boolean(dateISO) &&
      Number.isFinite(hours) &&
      hours > 0
    );
  }, [hoursInput, dateISO]);

  const addLog = () => {
    const hours = parseHours(hoursInput);

    if (!Number.isFinite(hours) || hours <= 0) {
      return;
    }

    const trimmedMealText = mealText?.trim();
    const nextSortOrder =
  Math.max(
    -1,
    ...logs
      .filter(
        (log) =>
          log.date === dateISO &&
          log.mealType === mealType
      )
      .map((log) => log.sortOrder ?? 0)
  ) + 1;
   const nextLog: Log = {
  id: uid(),
  date: dateISO,
  hours,
  sortOrder: nextSortOrder,
  ...(trimmedMealText
    ? { mealText: trimmedMealText }
    : {}),
  ...(mealType
    ? { mealType }
    : {}),
};

    setLogs((prev) => {
      const merged = [nextLog, ...prev];

      merged.sort((a, b) =>
        a.date < b.date
          ? 1
          : a.date > b.date
            ? -1
            : 0
      );

      return merged;
    });

    setHoursInput("");
    setMealText?.("");

    requestAnimationFrame(() => {
      hoursRef.current?.focus();
    });

    showAddedToast();
  };

  return {
    inputPreviewHours,
    canAdd,
    addLog,
  };
}