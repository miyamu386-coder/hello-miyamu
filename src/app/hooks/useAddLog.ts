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
  cardName: string;
  hoursInput: string;
  setTrainingSets: Dispatch<SetStateAction<string>>;
  trainingSets: string;
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
  cardName,
  hoursInput,
  trainingSets,
  setHoursInput,
  setTrainingSets,
  setLogs,
  hoursRef,
  mealText,
  setMealText,
  showAddedToast,
  mealType,
}: UseAddLogProps) {
const exerciseIdMap: Record<string, string> = {
  スクワット: "squat",
  腕立て伏せ: "push-up",
  腹筋: "crunch",
  プランク: "plank",
  ランジ: "lunge",

  "首・肩": "stretch-neck",
  "胸・肩": "stretch-chest",
  背中: "stretch-back",
  股関節: "stretch-hip",
  もも裏: "stretch-hamstring",
  ふくらはぎ: "stretch-calf",
};

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
  const sets = Number(trainingSets);
  const trainingId = exerciseIdMap[cardName];
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
  ...(trainingId
    ? {
        trainingId,
        trainingSets: Number.isFinite(sets) && sets > 0 ? sets : 1,
      }
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
    setTrainingSets("");
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