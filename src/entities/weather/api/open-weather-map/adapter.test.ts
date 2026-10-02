import { describe, expect, it } from "vitest";
import { adaptOwmCurrent, aggregateOwmDaily } from "./adapter";
import currentFixture from "./fixtures/current.json";
import forecastFixture from "./fixtures/forecast.json";
import type { OwmCurrentResponse, OwmForecastResponse } from "./types";

describe("adaptOwmCurrent", () => {
  it("адаптирует текущую погоду", () => {
    const snapshot = adaptOwmCurrent(currentFixture as OwmCurrentResponse);

    expect(snapshot.providerId).toBe("open-weather-map");
    expect(snapshot.timestamp).toBe(1736942400);
    expect(snapshot.temperatureC).toBe(-4.5);
    expect(snapshot.feelsLikeC).toBe(-9.2);
    expect(snapshot.humidityPct).toBe(85);
    expect(snapshot.pressureHpa).toBe(1013);
    expect(snapshot.windSpeedMs).toBe(4);
    expect(snapshot.condition).toBe("snow"); // OWM id 600
    expect(snapshot.description).toBe("небольшой снег");
  });
});

describe("aggregateOwmDaily", () => {
  const forecast = forecastFixture as OwmForecastResponse;

  it("схлопывает 3-часовые слоты в дни по локальному времени города", () => {
    const daily = aggregateOwmDaily(forecast.list, forecast.city.timezone);

    expect(daily).toHaveLength(2);
    expect(daily[0]).toEqual({
      date: "2025-01-15",
      tempMinC: -4.6, // min из двух слотов дня
      tempMaxC: -2.8,
      condition: "snow", // слот ближе всех к местному полудню
    });
    expect(daily[1]).toEqual({
      date: "2025-01-16",
      tempMinC: -7.8,
      tempMaxC: -6.5,
      condition: "clear",
    });
  });
});
