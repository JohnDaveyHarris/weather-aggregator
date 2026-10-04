import type { DailyForecastItem, WeatherReport, WeatherSnapshot } from "../../model/types";
import type { OpenMeteoForecastResponse } from "./types";
import { mapWmoCodeToCondition } from "./wmo-codes";

export function adaptOpenMeteo(raw: OpenMeteoForecastResponse): WeatherReport {
  const c = raw.current;

  const current: WeatherSnapshot = {
    providerId: "open-meteo",
    // Open-Meteo отдаёт локальное время точки без смещения. Приписываем "Z",
    // парсим как UTC и вычитаем смещение - получаем истиный UTC epoch.
    // Важно, иначе тесты будут зависеть от часового пояса машины.
    timestamp: Math.floor(Date.parse(`${c.time}Z`) / 1000) - raw.utc_offset_seconds,
    temperatureC: c.temperature_2m,
    feelsLikeC: c.apparent_temperature,
    humidityPct: c.relative_humidity_2m,
    pressureHpa: c.surface_pressure,
    windSpeedMs: c.wind_speed_10m / 3.6, // км/ч -> м/с
    condition: mapWmoCodeToCondition(c.weather_code),
  };

  const daily: DailyForecastItem[] = raw.daily.time.map((date, i) => ({
    date,
    tempMinC: raw.daily.temperature_2m_min[i],
    tempMaxC: raw.daily.temperature_2m_max[i],
    condition: mapWmoCodeToCondition(raw.daily.weather_code[i]),
  }));

  return { current, daily };
}
