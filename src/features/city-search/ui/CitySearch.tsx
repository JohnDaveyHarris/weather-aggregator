import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { geocodingApi } from "@/entities/city/api/geocoding/geocoding.api";
import type { City } from "@/entities/city/model/types";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface CitySearchProps {
  onSelect: (city: City) => void;
}

export function CitySearch({ onSelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const shouldSearch = debouncedQuery.trim().length >= 2;
  const { data: cities, isFetching } = geocodingApi.useSearchCitiesQuery(
    shouldSearch ? debouncedQuery.trim() : skipToken,
  );

  return (
    <div className="space-y-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Найти город…"
        autoComplete="off"
      />
      {isFetching && <Skeleton className="h-20 w-full" />}
      {!isFetching && cities?.length === 0 && (
        <p className="text-sm text-muted-foreground">Ничего не найдено</p>
      )}
      {!isFetching && !!cities?.length && (
        <ul className="divide-y rounded-lg border">
          {cities.map((city) => (
            <li key={city.id}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => {
                  onSelect(city);
                  setQuery("");
                }}
              >
                <span className="font-medium">{city.name}</span>
                {(city.admin1 || city.country) && (
                  <span className="text-muted-foreground">
                    , {[city.admin1, city.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
