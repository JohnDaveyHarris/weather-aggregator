import { openMeteoApi } from "../api/open-meteo/open-meteo.api";
import { openWeatherMapApi } from "../api/open-weather-map/open-weather-map.api";
import { weatherApiCom } from "../api/weather-api/weather-api.api";
import type { Coords, ProviderId, WeatherReport } from "./types";
import { PROVIDER_LABELS } from "./providers";

export interface ProviderState {
  providerId: ProviderId;
  label: string;
  report?: WeatherReport;
  isLoading: boolean;
  isError: boolean;
  isUninitialized: boolean;
  refetch: () => void;
}

export function useAllWeather(coords: Coords): ProviderState[] {
  const openMeteo = openMeteoApi.useGetWeatherQuery(coords);
  const openWeatherMap = openWeatherMapApi.useGetWeatherQuery(coords);
  const weatherApi = weatherApiCom.useGetWeatherQuery(coords);

  return [
    {
      providerId: "open-meteo",
      label: PROVIDER_LABELS["open-meteo"],
      report: openMeteo.data,
      isLoading: openMeteo.isLoading,
      isError: openMeteo.isError,
      isUninitialized: openMeteo.isUninitialized,
      refetch: openMeteo.refetch,
    },
    {
      providerId: "open-weather-map",
      label: PROVIDER_LABELS["open-weather-map"],
      report: openWeatherMap.data,
      isLoading: openWeatherMap.isLoading,
      isError: openWeatherMap.isError,
      isUninitialized: openWeatherMap.isUninitialized,
      refetch: openWeatherMap.refetch,
    },
    {
      providerId: "weather-api",
      label: PROVIDER_LABELS["weather-api"],
      report: weatherApi.data,
      isLoading: weatherApi.isLoading,
      isError: weatherApi.isError,
      isUninitialized: weatherApi.isUninitialized,
      refetch: weatherApi.refetch,
    },
  ];
}
