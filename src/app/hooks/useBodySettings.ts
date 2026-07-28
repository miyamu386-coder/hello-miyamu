import { useEffect, useState } from "react";

const STORAGE_KEY = "miyamu-body-settings";

type BodySettings = {
  targetWeight: number | null;
  dailyBaseKcal: number;
  dailyExtraKcal: number;
};

const INITIAL_SETTINGS: BodySettings = {
  targetWeight: null,
  dailyBaseKcal: 2200,
  dailyExtraKcal: 200,
};

export function useBodySettings() {
  const [settings, setSettings] =
    useState<BodySettings>(INITIAL_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<BodySettings>;

      setSettings({
        targetWeight:
          typeof parsed.targetWeight === "number"
            ? parsed.targetWeight
            : null,

        dailyBaseKcal:
          typeof parsed.dailyBaseKcal === "number"
            ? parsed.dailyBaseKcal
            : INITIAL_SETTINGS.dailyBaseKcal,

        dailyExtraKcal:
          typeof parsed.dailyExtraKcal === "number"
            ? parsed.dailyExtraKcal
            : INITIAL_SETTINGS.dailyExtraKcal,
      });
    } catch {
      setSettings(INITIAL_SETTINGS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
  }, [settings]);

  const setTargetWeight = (targetWeight: number) => {
    if (!Number.isFinite(targetWeight) || targetWeight <= 0) {
      return;
    }

    setSettings((prev) => ({
      ...prev,
      targetWeight,
    }));
  };

  const setDailyBaseKcal = (dailyBaseKcal: number) => {
    if (!Number.isFinite(dailyBaseKcal) || dailyBaseKcal <= 0) {
      return;
    }

    setSettings((prev) => ({
      ...prev,
      dailyBaseKcal,
    }));
  };

  const setDailyExtraKcal = (dailyExtraKcal: number) => {
    if (!Number.isFinite(dailyExtraKcal) || dailyExtraKcal < 0) {
      return;
    }

    setSettings((prev) => ({
      ...prev,
      dailyExtraKcal,
    }));
  };

  return {
    targetWeight: settings.targetWeight,
    dailyBaseKcal: settings.dailyBaseKcal,
    dailyExtraKcal: settings.dailyExtraKcal,
    setTargetWeight,
    setDailyBaseKcal,
    setDailyExtraKcal,
  };
}