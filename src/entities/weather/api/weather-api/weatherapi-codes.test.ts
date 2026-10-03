import { describe, expect, it } from "vitest";
import { mapWeatherApiCodeToCondition } from "./weatherapi-codes";
import type { WeatherCondition } from "../../model/types";

describe("mapWeatherApiCodeToCondition", () => {
  it.each<[number, WeatherCondition]>([
    [1000, "clear"],
    [1003, "partly-cloudy"],
    [1009, "cloudy"],
    [1135, "fog"],
    [1087, "thunderstorm"],
    [1183, "rain"],
    [1219, "snow"],
    [1264, "snow"], // ледяные крупки — отнесли к снегу
  ])("код %i → %s", (code, expected) => {
    expect(mapWeatherApiCodeToCondition(code)).toBe(expected);
  });
});