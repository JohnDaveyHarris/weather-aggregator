import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { geocodingApi } from "@/entities/city/api/geocoding/geocoding.api";
import { openMeteoApi } from "@/entities/weather/api/open-meteo/open-meteo.api";
import { openWeatherMapApi } from "@/entities/weather/api/open-weather-map/open-weather-map.api";
import { weatherApiCom } from "@/entities/weather/api/weather-api/weather-api.api";
import favoritesReducer from "@/features/favorites/model/favorites.slice";
import type { City } from "@/entities/city/model/types";
import { loadFavorites, saveFavorites } from "@/features/favorites/model/storage";

const rootReducer = {
  favorites: favoritesReducer,
  [geocodingApi.reducerPath]: geocodingApi.reducer,
  [openMeteoApi.reducerPath]: openMeteoApi.reducer,
  [openWeatherMapApi.reducerPath]: openWeatherMapApi.reducer,
  [weatherApiCom.reducerPath]: weatherApiCom.reducer,
};

/** preloadedFavorites — избранное из localStorage; в тестах не передаётся */
export const makeStore = (preloadedFavorites?: City[]) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedFavorites ? { favorites: { cities: preloadedFavorites } } : undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        geocodingApi.middleware,
        openMeteoApi.middleware,
        openWeatherMapApi.middleware,
        weatherApiCom.middleware,
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Синглтон приложения: избранное читается из localStorage один раз при старте,
// а подписка сохраняет изменения. В тестах используется makeStore() без обвязки.
export const store = makeStore(loadFavorites());

let prevFavorites = store.getState().favorites;
store.subscribe(() => {
  const nextFavorites = store.getState().favorites;
  if (nextFavorites === prevFavorites) return;
  prevFavorites = nextFavorites;
  saveFavorites(nextFavorites.cities);
});

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
