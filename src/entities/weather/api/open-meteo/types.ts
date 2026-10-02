/** Сырой ответ /v1/forecast */
export interface OpenMeteoForecastResponse {
  utc_offset_seconds: number;
  current: {
    /** локальное время точки, без смещения, например "2025-01-15T14:00" */
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    surface_pressure: number;
    weather_code: number;
    wind_speed_10m: number; // км/ч
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}
