/** YYYY-MM-DD から YYYY-MM を作る */
export function ymFromISO(dateISO: string): string {
  return dateISO.slice(0, 7);
}

/** 今日の YYYY-MM-DD */
export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}年${Number(m)}月`;
}

export function toSlashDate(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) return iso;

  return `${match[1]}/${match[2]}/${match[3]}`;
}
/** YYYY-MM を前後の月へ移動 */
export function moveMonth(ym: string, diff: number): string {
  const [year, month] = ym.split("-").map(Number);

  const date = new Date(year, month - 1 + diff, 1);

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}