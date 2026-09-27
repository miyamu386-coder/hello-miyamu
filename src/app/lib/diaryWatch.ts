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

// The Watch consumes dated, one-off schedules. Expand repeating entries here
// so its display, notifications, and reward IDs all refer to the same day.
export function expandSchedulesForWatch(
  schedules: DiaryWatchSchedule[],
  now = new Date()
): DiaryWatchSchedule[] {
  const pad = (value: number) => String(value).padStart(2, "0");
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const occurrences: DiaryWatchSchedule[] = [];

  for (let offset = 0; offset < 14; offset += 1) {
    const day = new Date(start.getFullYear(), start.getMonth(),
      start.getDate() + offset);
    const date = `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;

    for (const schedule of schedules) {
      if (!schedule.id || !schedule.startTime || date < schedule.date ||
          schedule.excludedDates?.includes(date)) continue;

      const matches = schedule.repeat === "weekly"
        ? schedule.weekdays?.includes(day.getDay())
        : schedule.repeat === "monthly"
          ? Number(schedule.date.slice(8, 10)) === day.getDate()
          : schedule.repeat === "yearly"
            ? schedule.date.slice(5) === date.slice(5)
            : date === schedule.date;
      if (!matches) continue;

      occurrences.push({
        ...schedule,
        id: `${schedule.id}:${date}`,
        date,
        repeat: "none",
        weekdays: [],
        excludedDates: [],
      });
    }
  }

  return occurrences
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
    .slice(0, 20);
}

export type DiaryWatchWeather = {
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
};
export type DiaryWatchWeatherWarnings = {
  area: {
    code: string;
    name: string;
  };
  warnings: {
    code: string;
    name: string;
  }[];
};

interface DiaryWatchPlugin {
  sendSchedules(options: {
  schedules: DiaryWatchSchedule[];
  weather?: DiaryWatchWeather;
  weatherWarnings?: DiaryWatchWeatherWarnings;
}): Promise<{
    sent: boolean;
    count: number;
  }>;
}

export const DiaryWatch =
  registerPlugin<DiaryWatchPlugin>(
    "DiaryWatch"
  );
