import type { ProviderId } from "./types";

export const PROVIDER_LABELS: Record<ProviderId, string> = {
  "open-meteo": "Open-Meteo",
  "open-weather-map": "OpenWeatherMap",
  "weather-api": "WeatherAPI.com",
};

export const PROVIDER_COLORS: Record<ProviderId, string> = {
  "open-meteo": "#0ea5e9",
  "open-weather-map": "#f97316",
  "weather-api": "#8b5cf6",
};