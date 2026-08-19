import { registerPlugin } from "@capacitor/core";

type AuthorizationResult = {
  authorized: boolean;
};

type StepsResult = {
  steps: number;
};

type SleepResult = {
  seconds: number;
  hours: number;
};

type HeartRateResult = {
  bpm: number | null;
  date?: string;
};

interface HealthKitPlugin {
  requestAuthorization(): Promise<AuthorizationResult>;
  getSteps(): Promise<StepsResult>;
  getSleep(): Promise<SleepResult>;
  getHeartRate(): Promise<HeartRateResult>;
}

export const HealthKit =
  registerPlugin<HealthKitPlugin>("HealthKit");