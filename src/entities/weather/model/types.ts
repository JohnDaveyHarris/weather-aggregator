export type ProviderId = "open-meteo" | "open-weather-map" | "weather-api";

export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "thunderstorm";

export interface Coords {
  lat: number;
  lon: number;
}

export interface WeatherSnapshot {
  providerId: ProviderId;
  /** UTC epoch, секунды */
  timestamp: number;
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  pressureHpa: number;
  windSpeedMs: number;
  condition: WeatherCondition;
  description?: string;
}

export interface DailyForecastItem {
  /** YYYY-MM-DD */
  date: string;
  tempMinC: number;
  tempMaxC: number;
  condition: WeatherCondition;
}

export interface WeatherReport {
  current: WeatherSnapshot;
  daily: DailyForecastItem[];
}
