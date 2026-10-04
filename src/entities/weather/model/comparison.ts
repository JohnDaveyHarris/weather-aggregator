import type { ProviderId, WeatherReport } from "./types";

/** Отчёт одного провайдера для наложения на графике */
export interface ProviderSeries {
  providerId: ProviderId;
  report: WeatherReport;
}

/** Строка данных для recharts */
export type ComparisonRow = { date: string } & Partial<Record<ProviderId, number>>;

/** Объединяет дневные прогнозы всех провайдеров по датам */
export function buildComparisonRows(series: ProviderSeries[]): ComparisonRow[] {
  const dates = [...new Set(series.flatMap((s) => s.report.daily.map((d) => d.date)))].sort();

  return dates.map((date) => {
    const row: ComparisonRow = { date };
    for (const s of series) {
      const day = s.report.daily.find((d) => d.date === date);
      if (day) row[s.providerId] = day.tempMaxC;
    }
    return row;
  });
}
