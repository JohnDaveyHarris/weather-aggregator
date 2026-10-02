/** Сырой ответ /v1/search геокодинга Open-Meteo */
export interface GeocodingSearchResponse {
  /** Ключ отсутствует, если ничего не найдено */
  results?: GeocodingPlaceRaw[];
}

export interface GeocodingPlaceRaw {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
  population?: number;
}
