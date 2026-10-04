import type { City } from "@/entities/city/model/types";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectFavorites, toggleFavorite } from "@/features/favorites/model/favorites.slice";
import { Button } from "@/components/ui/button";

export function FavoriteToggle({ city }: { city: City }) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const isFavorite = favorites.some((c) => c.id === city.id);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      onClick={() => dispatch(toggleFavorite(city))}
    >
      <span className="text-xl leading-none">{isFavorite ? "★" : "☆"}</span>
    </Button>
  );
}
