export const WORK_MIN = 5;
export const WORK_MAX = 300;
export const BREAK_MIN = 0;
export const BREAK_MAX = 180;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function parseDuration(value: string, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(parsed) ? clamp(parsed, min, max) : fallback;
}
