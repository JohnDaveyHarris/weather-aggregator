import { describe, expect, it } from "vitest";
import { computeTempSpread } from "./spread";
import type { WeatherReport } from "./types";

function reportWithTemp(temperatureC: number): WeatherReport {
  return {
    current: {
      providerId: "open-meteo",
      timestamp: 0,
      temperatureC,
      feelsLikeC: 0,
      humidityPct: 0,
      pressureHpa: 0,
      windSpeedMs: 0,
      condition: "clear",
    },
    daily: [],
  };
}

describe("computeTempSpread", () => {
  it("считает min/max по источникам", () => {
    expect(
      computeTempSpread([reportWithTemp(18.4), reportWithTemp(21), reportWithTemp(19.9)]),
    ).toEqual({ minC: 18.4, maxC: 21 });
  });

  it("один источник — разброса нет", () => {
    expect(computeTempSpread([reportWithTemp(10)])).toBeNull();
  });

  it("пустой список — null", () => {
    expect(computeTempSpread([])).toBeNull();
  });
});
