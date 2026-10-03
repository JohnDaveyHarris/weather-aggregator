import { describe, expect, it } from "vitest";
import { adaptWeatherApi } from "./adapter";
import fixture from "./fixtures/forecast.json";
import type { WeatherApiForecastResponse } from "./types";

describe("adaptWeatherApi", () => {
  const report = adaptWeatherApi(fixture as WeatherApiForecastResponse);

  it("адаптирует текущую погоду", () => {
    expect(report.current.providerId).toBe("weather-api");
    expect(report.current.timestamp).toBe(1736938800);
    expect(report.current.temperatureC).toBe(-3.9);
    expect(report.current.feelsLikeC).toBe(-8.4);
    expect(report.current.humidityPct).toBe(88);
    expect(report.current.pressureHpa).toBe(1007);
    expect(report.current.windSpeedMs).toBeCloseTo(3); // 10.8 км/ч → 3 м/с
    expect(report.current.condition).toBe("snow");
    expect(report.current.description).toBe("Умеренный снег");
  });

  it("адаптирует дневной прогноз", () => {
    expect(report.daily).toHaveLength(3);
    expect(report.daily[1]).toEqual({
      date: "2025-01-16",
      tempMinC: -8.1,
      tempMaxC: -4.4,
      condition: "clear",
    });
  });
});