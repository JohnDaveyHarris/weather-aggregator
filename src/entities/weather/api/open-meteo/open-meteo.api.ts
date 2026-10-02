import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Coords, WeatherReport } from "../../model/types";
import { adaptOpenMeteo } from "./adapter";

export const openMeteoApi = createApi({
  reducerPath: "openMeteoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.open-meteo.com/v1" }),
  endpoints: (build) => ({
    getWeather: build.query<WeatherReport, Coords>({
      query: ({ lat, lon }) => ({
        url: "/forecast",
        params: {
          latitude: lat,
          longitude: lon,
          timezone: "auto",
          forecast_days: 7,
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,weather_code,wind_speed_10m",
          daily: "weather_code,temperature_2m_max,temperature_2m_min",
        },
      }),
      transformResponse: adaptOpenMeteo,
    }),
  }),
});

export const { useGetWeatherQuery } = openMeteoApi;
