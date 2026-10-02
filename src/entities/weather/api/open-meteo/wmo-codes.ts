import type { WeatherCondition } from "../../model/types";

/**
 * WMO weather code - нормализованное состояние.
 * Таблица: https://open-meteo.com/en/docs (параметр weather_code)
 */
export function mapWmoCodeToCondition(code: number): WeatherCondition {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly-cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "thunderstorm";
  return "cloudy";
}
