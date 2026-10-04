import { describe, expect, it } from "vitest";
import { buildComparisonRows } from "./comparison";
import type { DailyForecastItem, ProviderId, WeatherReport } from "./types";

function fakeReport(providerId: ProviderId, daily: DailyForecastItem[]): WeatherReport {
  return {
    current: {
      providerId,
      timestamp: 0,
      temperatureC: 0,
      feelsLikeC: 0,
      humidityPct: 0,
      pressureHpa: 0,
      windSpeedMs: 0,
      condition: "clear",
    },
    daily,
  };
}

describe("buildComparisonRows", () => {
  const openMeteo = fakeReport("open-meteo", [
    { date: "2025-01-15", tempMinC: -5, tempMaxC: -2, condition: "clear" },
    { date: "2025-01-16", tempMinC: -7, tempMaxC: -4, condition: "clear" },
  ]);
  const owm = fakeReport("open-weather-map", [
    { date: "2025-01-15", tempMinC: -6, tempMaxC: -3, condition: "cloudy" },
  ]);

  it("объединяет прогнозы по датам", () => {
    expect(
      buildComparisonRows([
        { providerId: "open-meteo", report: openMeteo },
        { providerId: "open-weather-map", report: owm },
      ]),
    ).toEqual([
      { date: "2025-01-15", "open-meteo": -2, "open-weather-map": -3 },
      { date: "2025-01-16", "open-meteo": -4 },
    ]);
  });

  it("без серий — пустой список", () => {
    expect(buildComparisonRows([])).toEqual([]);
  });
});
