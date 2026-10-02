import type { WeatherCondition } from "../../model/types";

/**
 * Группы кодов условий OWM:
 * 2xx — гроза, 3xx — морось, 5xx — дождь, 6xx — снег,
 * 7xx — атмосферные явления, 800 — ясно, 80x — облачность.
 * https://openweathermap.org/weather-conditions
 */
export function mapOwmIdToCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return "thunderstorm";
  if ((id >= 300 && id < 400) || (id >= 500 && id < 600)) return "rain";
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "fog"; // дымка, мгла и др.
  if (id === 800) return "clear";
  if (id <= 802) return "partly-cloudy";
  return "cloudy";
}
