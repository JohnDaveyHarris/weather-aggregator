import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { City } from "@/entities/city/model/types";

export interface FavoritesState {
  cities: City[];
}

const initialState: FavoritesState = { cities: [] };

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<City>) {
      const index = state.cities.findIndex((c) => c.id === action.payload.id);
      if (index === -1) state.cities.push(action.payload);
      else state.cities.splice(index, 1);
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.cities = state.cities.filter((c) => c.id !== action.payload);
    },
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.cities;
