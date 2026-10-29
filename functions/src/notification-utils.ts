/** Pure rules extracted from the deployed notification implementation. */
export const ECUADOR_UTC_OFFSET_MS = 5 * 60 * 60 * 1000;
export function normalizeFcmData(input: Record<string, unknown> = {}): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string") result[key] = value;
    else if (typeof value === "number" || typeof value === "boolean") result[key] = String(value);
    else { try { result[key] = JSON.stringify(value); } catch { result[key] = String(value); } }
  }
  return result;
}
export function getEcuadorDateString(deltaDays: number, now = Date.now()): string {
  return new Date(now - ECUADOR_UTC_OFFSET_MS + deltaDays * 86400000).toISOString().slice(0, 10);
}
export function parseLocalEcuadorDateTimeToUtcMs(dateStr: string, timeStr: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || "") || !/^\d{1,2}:\d{2}$/.test(timeStr || "")) return Number.NaN;
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return Number.NaN;
  const utc = Date.UTC(year, month - 1, day, hour + 5, minute);
  if (new Date(utc - ECUADOR_UTC_OFFSET_MS).toISOString().slice(0, 10) !== dateStr) return Number.NaN;
  return utc;
}
export function shouldRunInWindow(now: number, start: number, end: number): boolean {
  return Number.isFinite(now) && Number.isFinite(start) && Number.isFinite(end) && now >= start && now < end;
}
