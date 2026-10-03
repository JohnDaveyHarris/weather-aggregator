import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { geocodingApi } from "@/entities/city/api/geocoding/geocoding.api";
import { openMeteoApi } from "@/entities/weather/api/open-meteo/open-meteo.api";
import {openWeatherMapApi} from "@/entities/weather/api/open-weather-map/open-weather-map.api.ts";
import {weatherApiCom} from "@/entities/weather/api/weather-api/weather-api.api.ts";
import favoritesReducer from "@/features/favorites/model/favorites.slice";
import {loadFavorites, saveFavorites} from "@/features/favorites/model/storage.ts";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    [geocodingApi.reducerPath]: geocodingApi.reducer,
    [openMeteoApi.reducerPath]: openMeteoApi.reducer,
    [openWeatherMapApi.reducerPath]: openWeatherMapApi.reducer,
    [weatherApiCom.reducerPath]: weatherApiCom.reducer,
  },
  preloadedState: { favorites: { cities: loadFavorites() } },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      geocodingApi.middleware,
      openMeteoApi.middleware,
      openWeatherMapApi.middleware,
      weatherApiCom.middleware,
    ),
});

// пишем в localStorage только когда слайс favorites реально изменился
let prevFavorites = store.getState().favorites;
store.subscribe(() => {
  const nextFavorites = store.getState().favorites;
  if (nextFavorites === prevFavorites) return;
  prevFavorites = nextFavorites;
  saveFavorites(nextFavorites.cities);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
