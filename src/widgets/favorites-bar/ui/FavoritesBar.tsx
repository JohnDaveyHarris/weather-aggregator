import type { City } from "@/entities/city/model/types";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { removeFavorite, selectFavorites } from "@/features/favorites/model/favorites.slice";

interface FavoritesBarProps {
  onSelect: (city: City) => void;
}

export function FavoritesBar({ onSelect }: FavoritesBarProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);

  if (favorites.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {favorites.map((city) => (
        <span
          key={city.id}
          className="inline-flex items-center gap-0.5 rounded-full border bg-secondary py-1 pl-3 pr-1.5 text-sm"
        >
          <button
            type="button"
            className="font-medium hover:underline"
            onClick={() => onSelect(city)}
          >
            {city.name}
          </button>
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Убрать ${city.name} из избранного`}
            onClick={() => dispatch(removeFavorite(city.id))}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}