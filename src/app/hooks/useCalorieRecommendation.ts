import { useEffect, useMemo, useState } from "react";

type ActivityLevel = "low" | "normal" | "high";

type CalorieProfile = {
  age: number;
  heightCm: number;
  weightKg: number;
  sex: "male" | "female";
  activityLevel: ActivityLevel;
};

const STORAGE_KEY = "miyamu-custom-recommended-kcal";

const DEFAULT_PROFILE: CalorieProfile = {
  age: 40,
  heightCm: 174,
  weightKg: 60,
  sex: "male",
  activityLevel: "normal",
};

export function useCalorieRecommendation() {
  const [customRecommendedKcal, setCustomRecommendedKcal] =
    useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    const parsed = Number(saved);

    if (Number.isFinite(parsed) && parsed > 0) {
      setCustomRecommendedKcal(parsed);
    }
  }, []);

  useEffect(() => {
    if (customRecommendedKcal === null) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      String(customRecommendedKcal)
    );
  }, [customRecommendedKcal]);

  const automaticRecommendedKcal = useMemo(() => {
    const basalMetabolicRate =
      DEFAULT_PROFILE.sex === "male"
        ? 10 * DEFAULT_PROFILE.weightKg +
          6.25 * DEFAULT_PROFILE.heightCm -
          5 * DEFAULT_PROFILE.age +
          5
        : 10 * DEFAULT_PROFILE.weightKg +
          6.25 * DEFAULT_PROFILE.heightCm -
          5 * DEFAULT_PROFILE.age -
          161;

    const activityMultiplier =
      DEFAULT_PROFILE.activityLevel === "low"
        ? 1.2
        : DEFAULT_PROFILE.activityLevel === "high"
          ? 1.725
          : 1.55;

    return Math.round(
      basalMetabolicRate * activityMultiplier
    );
  }, []);

  const recommendedKcal =
    customRecommendedKcal ?? automaticRecommendedKcal;

  return {
    profile: DEFAULT_PROFILE,
    automaticRecommendedKcal,
    customRecommendedKcal,
    recommendedKcal,
    setCustomRecommendedKcal,
  };
}