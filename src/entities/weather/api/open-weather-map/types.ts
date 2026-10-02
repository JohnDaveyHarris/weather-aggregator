/** Сырой ответ /data/2.5/weather */
export interface OwmCurrentResponse {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    id: number;
    description: string;
  }[];
}

/** Сырой ответ /data/2.5/forecast (3-часовые слоты) */
export interface OwmForecastResponse {
  city: {
    /** Смещение часового пояса города, секунды */
    timezone: number;
  };
  list: OwmForecastItem[];
}

export interface OwmForecastItem {
  /** UTC epoch, секунды */
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: {
    id: number;
  }[];
}
