import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Coords, WeatherReport } from "../../model/types";
import { adaptWeatherApi } from "./adapter";
import { apiUrl } from "@/shared/lib/api-url.ts";

export const weatherApiCom = createApi({
  reducerPath: "weatherApiCom",
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl("/api/weatherapi") }),
  endpoints: (build) => ({
    getWeather: build.query<WeatherReport, Coords>({
      query: ({ lat, lon }) => ({
        url: "/forecast",
        params: {
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
