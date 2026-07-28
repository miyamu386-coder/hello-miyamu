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
      const parsed = JSON.parse(saved) as BodySettings;

      setSettings({
        targetWeight:
          typeof parsed.targetWeight === "number"
            ? parsed.targetWeight
            : null,
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

  return {
    targetWeight: settings.targetWeight,
    setTargetWeight,
  };
}