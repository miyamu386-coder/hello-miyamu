import type { MealType } from "./components/DiaryInputForm";

export type TrainingUnit = "reps" | "seconds";

export type Log = {
  id: string;
  date: string;
  hours: number;
  mealText?: string;
  mealType?: MealType;
  sortOrder?: number;

  trainingId?: string;
  trainingSets?: number;
  trainingUnit?: TrainingUnit;
};