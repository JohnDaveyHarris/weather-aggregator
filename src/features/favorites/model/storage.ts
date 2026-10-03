import type { City } from "@/entities/city/model/types";

export const STORAGE_KEY = "weather-aggregator:favorites:v1";

export function loadFavorites(): City[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    return parseFavorites(JSON.parse(raw));
  } catch {
    // битый JSON или недоступный localStorage - считаем, что избранного нет
    return [];
  }
}

export function saveFavorites(cities: City[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    // приватный режим / переполненная квота - молча игнорируем
  }
}

/** Защита от мусора в хранилище: отбираем только валидные города */
export function parseFavorites(data: unknown): City[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (item): item is City =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "number" &&
      typeof item.name === "string" &&
      typeof item.latitude === "number" &&
      typeof item.longitude === "number",
  );
}