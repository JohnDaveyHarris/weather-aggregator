export interface WeatherApiForecastResponse {
  location: {
    /** UTC epoch, секунды — текущее время точки */
    localtime_epoch: number;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    pressure_mb: number;
    wind_kph: number;
    condition: { code: number; text: string };
  };
  forecast: {
    forecastday: {
      /** YYYY-MM-DD, локальная дата точки */
      date: string;
      day: {
        mintemp_c: number;
        maxtemp_c: number;
        condition: { code: number };
      };
    }[];
  };
}
