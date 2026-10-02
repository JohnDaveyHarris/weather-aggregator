import { describe, expect, it } from "vitest";
import { mapOwmIdToCondition } from "./owm-codes";
import type { WeatherCondition } from "../../model/types";

describe("mapOwmIdToCondition", () => {
  it.each<[number, WeatherCondition]>([
    [212, "thunderstorm"],
    [313, "rain"], // морось тоже дождь
    [511, "rain"],
    [615, "snow"],
    [741, "fog"],
    [800, "clear"],
    [801, "partly-cloudy"],
    [804, "cloudy"],
  ])("код %i → %s", (id, expected) => {
    expect(mapOwmIdToCondition(id)).toBe(expected);
  });
});
