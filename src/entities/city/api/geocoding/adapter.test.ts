import { describe, expect, it } from "vitest";
import { adaptGeocodingResults } from "./adapter";
import fixture from "./fixtures/search.json";
import type { GeocodingSearchResponse } from "./types";

describe("adaptGeocodingResults", () => {
  it("адаптирует результаты поиска", () => {
    const cities = adaptGeocodingResults(fixture as GeocodingSearchResponse);

    expect(cities).toHaveLength(2);
    expect(cities[0]).toEqual({
      id: 524901,
      name: "Москва",
      country: "Россия",
      admin1: "Москва",
      latitude: 55.75222,
      longitude: 37.61556,
    });
  });

  it("возвращает [], когда results отсутствует", () => {
    expect(adaptGeocodingResults({})).toEqual([]);
  });
});
