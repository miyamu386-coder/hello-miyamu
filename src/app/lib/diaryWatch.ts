import { registerPlugin } from "@capacitor/core";

export type DiaryWatchSchedule = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  memo: string;
  repeat:
  | "none"
  | "weekly"
  | "monthly"
  | "yearly";
  weekdays?: number[];
  excludedDates?: string[];
};

export type DiaryWatchWeather = {
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
};

interface DiaryWatchPlugin {
  sendSchedules(options: {
    schedules: DiaryWatchSchedule[];
    weather?: DiaryWatchWeather;
  }): Promise<{
    sent: boolean;
    count: number;
  }>;
}

export const DiaryWatch =
  registerPlugin<DiaryWatchPlugin>(
    "DiaryWatch"
  );