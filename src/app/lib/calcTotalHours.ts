import type { Log } from "../types";

export function calcTotalHours(logs: Log[]): number {
  return logs.reduce((sum, log) => sum + log.hours, 0);
}