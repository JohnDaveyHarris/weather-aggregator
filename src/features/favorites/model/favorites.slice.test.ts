import { describe, expect, it } from "vitest";
import favoritesReducer, {
  removeFavorite,
  toggleFavorite,
} from "./favorites.slice";
import type { City } from "@/entities/city/model/types";

const moscow: City = { id: 524901, name: "Москва", latitude: 55.75, longitude: 37.62 };
const spb: City = { id: 498817, name: "Санкт-Петербург", latitude: 59.94, longitude: 30.31 };

describe("favoritesSlice", () => {
  it("добавляет город", () => {
    const state = favoritesReducer({ cities: [] }, toggleFavorite(moscow));
    expect(state.cities).toEqual([moscow]);
  });

  it("повторный toggle убирает город", () => {
    let state = favoritesReducer({ cities: [] }, toggleFavorite(moscow));
    state = favoritesReducer(state, toggleFavorite(moscow));
    expect(state.cities).toEqual([]);
  });

  it("сопоставляет города по id: toggle копии объекта не создаёт дубликат", () => {
    let state = favoritesReducer({ cities: [] }, toggleFavorite(moscow));
    state = favoritesReducer(state, toggleFavorite(spb));
    // тот же id 524901, но другой объект — как будто геокодинг вернул расширенные данные
    state = favoritesReducer(state, toggleFavorite({ ...moscow, country: "Россия" }));

    // если матчинг по ссылке — копия добавится третьей ([moscow, spb, copy]);
    // правильное поведение: Москва удалилась по id, СПб остался
    expect(state.cities).toEqual([spb]);
  });

  it("removeFavorite удаляет по id", () => {
    const state = favoritesReducer({ cities: [moscow, spb] }, removeFavorite(moscow.id));
    expect(state.cities).toEqual([spb]);
  });
});