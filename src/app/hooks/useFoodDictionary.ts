import { useEffect, useMemo, useState } from "react";
import {
  FOOD_DICTIONARY,
  type FoodDictionaryItem,
} from "../data/foodDictionary";

const STORAGE_KEY = "miyamu-food-dictionary";

export function useFoodDictionary() {
  const [customFoods, setCustomFoods] = useState<FoodDictionaryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as FoodDictionaryItem[];

      if (Array.isArray(parsed)) {
        setCustomFoods(parsed);
      }
    } catch {
      setCustomFoods([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(customFoods)
    );
  }, [customFoods]);

  const foods = useMemo(
    () => [...FOOD_DICTIONARY, ...customFoods],
    [customFoods]
  );

  const addFood = (name: string, kcal: number) => {
    const trimmed = name.trim();

    if (!trimmed || !Number.isFinite(kcal) || kcal < 0) {
      return;
    }

    setCustomFoods((prev) => [
      ...prev,
      {
  id: crypto.randomUUID(),
  name: trimmed,
  baseName: trimmed,
  kcal,
  isDefault: true,
},
    ]);
  };

  const removeFood = (id: string) => {
    setCustomFoods((prev) =>
      prev.filter((food) => food.id !== id)
    );
  };

  return {
    foods,
    addFood,
    removeFood,
  };
}