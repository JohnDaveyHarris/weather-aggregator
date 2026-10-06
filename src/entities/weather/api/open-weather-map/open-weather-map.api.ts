import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Coords, WeatherReport } from "../../model/types";
import { adaptOwmCurrent, aggregateOwmDaily } from "./adapter";
import type { OwmCurrentResponse, OwmForecastResponse } from "./types";
import {apiUrl} from "@/shared/lib/api-url.ts";

export const openWeatherMapApi = createApi({
  reducerPath: "openWeatherMapApi",
  baseQuery: fetchBaseQuery({ baseUrl:  apiUrl("/api/open-weather-map") }),
  endpoints: (build) => ({
    getWeather: build.query<WeatherReport, Coords>({
      queryFn: async ({ lat, lon }, _api, _extra, fetchWithBQ) => {
        const params = { lat, lon, units: "metric", lang: "ru" };
        const [currentRes, forecastRes] = await Promise.all([
          fetchWithBQ({ url: "/weather", params }),
          fetchWithBQ({ url: "/forecast", params }),
        ]);

        if (currentRes.error) return { error: currentRes.error };
        if (forecastRes.error) return { error: forecastRes.error };

        const forecast = forecastRes.data as OwmForecastResponse;
        return {
          data: {
            current: adaptOwmCurrent(currentRes.data as OwmCurrentResponse),
            daily: aggregateOwmDaily(forecast.list, forecast.city.timezone),
          },
        };
      },
    }),
  }),
});
