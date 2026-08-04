import type { MealType } from "./components/DiaryInputForm";

export type Log = {
  id: string;
  date: string;
  hours: number;
  mealText?: string;
  mealType?: MealType;
  sortOrder?: number;
};