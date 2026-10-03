import type {
  DailyForecastItem,
  WeatherReport,
  WeatherSnapshot,
} from "../../model/types";
import type { WeatherApiForecastResponse } from "./types";
import { mapWeatherApiCodeToCondition } from "./weatherapi-codes";

export function adaptWeatherApi(raw: WeatherApiForecastResponse): WeatherReport {
  const c = raw.current;

  const current: WeatherSnapshot = {
    providerId: "weather-api",
    // WeatherAPI сразу отдаёт UTC epoch - не пересчитываем
    timestamp: raw.location.localtime_epoch,
    temperatureC: c.temp_c,
    feelsLikeC: c.feelslike_c,
    humidityPct: c.humidity,
    pressureHpa: c.pressure_mb,
    windSpeedMs: c.wind_kph / 3.6, // км/ч -> м/с
    condition: mapWeatherApiCodeToCondition(c.condition.code),
    description: c.condition.text,
  };

  const daily: DailyForecastItem[] = raw.forecast.forecastday.map((d) => ({
    date: d.date,
    tempMinC: d.day.mintemp_c,
    tempMaxC: d.day.maxtemp_c,
    condition: mapWeatherApiCodeToCondition(d.day.condition.code),
  }));

  return { current, daily };
}