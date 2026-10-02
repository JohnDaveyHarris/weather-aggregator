import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { City } from "../../model/types";
import { adaptGeocodingResults } from "./adapter";

export const geocodingApi = createApi({
  reducerPath: "geocodingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://geocoding-api.open-meteo.com/v1",
  }),
  endpoints: (build) => ({
    searchCities: build.query<City[], string>({
      query: (name) => ({
        url: "/search",
        params: { name, count: 5, language: "ru", format: "json" },
      }),
      transformResponse: adaptGeocodingResults,
    }),
  }),
});

export const { useSearchCitiesQuery } = geocodingApi;
