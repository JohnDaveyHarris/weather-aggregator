import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { geocodingApi } from "@/entities/city/api/geocoding/geocoding.api";
import { openMeteoApi } from "@/entities/weather/api/open-meteo/open-meteo.api";
import {openWeatherMapApi} from "@/entities/weather/api/open-weather-map/open-weather-map.api.ts";

export const store = configureStore({
  reducer: {
    [geocodingApi.reducerPath]: geocodingApi.reducer,
    [openMeteoApi.reducerPath]: openMeteoApi.reducer,
    [openWeatherMapApi.reducerPath]: openWeatherMapApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      geocodingApi.middleware,
      openMeteoApi.middleware,
      openWeatherMapApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
