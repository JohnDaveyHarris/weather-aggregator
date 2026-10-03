import type { WeatherReport } from "./types";

export interface TempSpread {
  minC: number;
  maxC: number;
}

/** Разброс текущей температуры между источниками */
export function computeTempSpread(reports: WeatherReport[]): TempSpread | null {
  if (reports.length < 2) return null;
  const temps = reports.map((r) => r.current.temperatureC);
  return { minC: Math.min(...temps), maxC: Math.max(...temps) };
}