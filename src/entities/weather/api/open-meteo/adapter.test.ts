import { describe, expect, it } from "vitest";
import { adaptOpenMeteo } from "./adapter";
import fixture from "./fixtures/forecast.json";
import type { OpenMeteoForecastResponse } from "./types";

const raw = fixture as OpenMeteoForecastResponse;

describe("adaptOpenMeteo", () => {
  const report = adaptOpenMeteo(raw);

  it("адаптирует текущую погоду", () => {
    expect(report.current.temperatureC).toBe(-4.2);
    expect(report.current.feelsLikeC).toBe(-9.1);
    expect(report.current.humidityPct).toBe(86);
    expect(report.current.pressureHpa).toBe(1013.8);
    expect(report.current.windSpeedMs).toBeCloseTo(4); // 14.4 км/ч -> 4 м/с
    expect(report.current.condition).toBe("snow"); // WMO 71
    expect(report.current.providerId).toBe("open-meteo");
  });

  it("переводит локальное время точки в UTC epoch", () => {
    // "2025-01-15T14:00" при UTC+3 - это 11:00 UTC
    expect(report.current.timestamp).toBe(Date.parse("2025-01-15T11:00:00Z") / 1000);
  });

  it("адаптирует дневной прогноз", () => {
    expect(report.daily).toHaveLength(3);
    expect(report.daily[0]).toEqual({
      date: "2025-01-15",
      tempMinC: -9.7,
      tempMaxC: -2.1,
      condition: "snow",
    });
    expect(report.daily[1].condition).toBe("cloudy"); // WMO 3
    expect(report.daily[2].condition).toBe("clear"); // WMO 0
  });
});
