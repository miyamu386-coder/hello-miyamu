/** 全角→半角など「数値入力としてありがちな文字」を正規化 */
export function normalizeNumberString(raw: string): string {
  return raw
    .trim()
    .replace(/[０-９]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    )
    .replace(/[．。]/g, ".")
    .replace(/[，、]/g, ".")
    .replace(/[－]/g, "-")
    .replace(/[\s　]/g, "");
}

export function parseHours(raw: string): number {
  const normalized = normalizeNumberString(raw);

  if (!normalized) return Number.NaN;

  const value = Number(normalized);

  return Number.isFinite(value) ? value : Number.NaN;
}