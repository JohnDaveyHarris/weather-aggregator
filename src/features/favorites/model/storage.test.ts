// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEY, loadFavorites, parseFavorites, saveFavorites } from "./storage";
import type { City } from "@/entities/city/model/types";

const moscow: City = { id: 1, name: "Москва", latitude: 55.75, longitude: 37.62 };

beforeEach(() => localStorage.clear());

describe("loadFavorites / saveFavorites", () => {
  it("сохраняет и загружает обратно", () => {
    saveFavorites([moscow]);
    expect(loadFavorites()).toEqual([moscow]);
  });

  it("пустое хранилище → []", () => {
    expect(loadFavorites()).toEqual([]);
  });

  it("битый JSON → [], приложение не падает", () => {
    localStorage.setItem(STORAGE_KEY, "{oops");
    expect(loadFavorites()).toEqual([]);
  });

  it("мусор среди данных фильтруется", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([moscow, { id: "x" }, null, 42]));
    expect(loadFavorites()).toEqual([moscow]);
  });
});

describe("parseFavorites", () => {
  it("не массив → []", () => {
    expect(parseFavorites({ cities: [moscow] })).toEqual([]);
  });
});
