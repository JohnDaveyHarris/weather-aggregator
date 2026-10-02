import { describe, expect, it } from "vitest";
import { mapWmoCodeToCondition } from "./wmo-codes";
import type { WeatherCondition } from "../../model/types";

describe("mapWmoCodeToCondition", () => {
  it.each<[number, WeatherCondition]>([
    [0, "clear"],
    [2, "partly-cloudy"],
    [3, "cloudy"],
    [45, "fog"],
    [61, "rain"],
    [71, "snow"],
    [95, "thunderstorm"],
  ])("код %i → %s", (code, expected) => {
    expect(mapWmoCodeToCondition(code)).toBe(expected);
  });
});
