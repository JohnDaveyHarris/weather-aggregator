import type { DailyForecastItem, WeatherSnapshot } from "../../model/types";
import type { OwmCurrentResponse, OwmForecastItem } from "./types";
import { mapOwmIdToCondition } from "./owm-codes";

export function adaptOwmCurrent(raw: OwmCurrentResponse): WeatherSnapshot {
  return {
    providerId: "open-weather-map",
    // OWM сразу отдаёт UTC epoch - не пересчитываем
    timestamp: raw.dt,
    temperatureC: raw.main.temp,
    feelsLikeC: raw.main.feels_like,
    humidityPct: raw.main.humidity,
    pressureHpa: raw.main.pressure,
    windSpeedMs: raw.wind.speed, // с units=metric OWM даёт м/с
    condition: mapOwmIdToCondition(raw.weather[0].id),
    description: raw.weather[0].description,
  };
}

/**
 * Схлопывает 3-часовые слоты в дневной прогноз.
 * Слоты идут в UTC, поэтому дату считаем по локальному времени города:
 * сдвигаем epoch на city.timezone и читаем UTC-поля.
 */
export function aggregateOwmDaily(
  list: OwmForecastItem[],
  timezoneOffsetSec: number,
): DailyForecastItem[] {
  const byDate = new Map<string, { min: number; max: number; noonId: number; noonDist: number }>();

  for (const item of list) {
    const local = new Date((item.dt + timezoneOffsetSec) * 1000);
    const date = local.toISOString().slice(0, 10);
    const hourDist = Math.abs(local.getUTCHours() - 12);

    const entry = byDate.get(date) ?? {
      min: Infinity,
      max: -Infinity,
      noonId: 800,
      noonDist: Infinity,
    };
    entry.min = Math.min(entry.min, item.main.temp_min);
    entry.max = Math.max(entry.max, item.main.temp_max);
    if (hourDist < entry.noonDist) {
      entry.noonId = item.weather[0].id;
      entry.noonDist = hourDist;
    }
    byDate.set(date, entry);
  }

  return [...byDate.entries()].map(([date, e]) => ({
    date,
    tempMinC: e.min,
    tempMaxC: e.max,
    condition: mapOwmIdToCondition(e.noonId),
  }));
}
