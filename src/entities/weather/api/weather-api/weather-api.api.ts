import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Coords, WeatherReport } from "../../model/types";
import { adaptWeatherApi } from "./adapter";

export const weatherApiCom = createApi({
  reducerPath: "weatherApiCom",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.weatherapi.com/v1" }),
  endpoints: (build) => ({
    getWeather: build.query<WeatherReport, Coords>({
      query: ({ lat, lon }) => ({
        url: "/forecast.json",
        params: {
          key: import.meta.env.VITE_WEATHER_API_KEY,
          q: `${lat},${lon}`,
          days: 3, // максимум free-тарифа
          aqi: "no",
          alerts: "no",
          lang: "ru",
        },
      }),
      transformResponse: adaptWeatherApi,
    }),
  }),
});