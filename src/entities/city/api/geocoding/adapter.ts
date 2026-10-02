import type { City } from "../../model/types";
import type { GeocodingSearchResponse } from "./types";

export function adaptGeocodingResults(raw: GeocodingSearchResponse): City[] {
  return (raw.results ?? []).map((place) => ({
    id: place.id,
    name: place.name,
    country: place.country,
    admin1: place.admin1,
    latitude: place.latitude,
    longitude: place.longitude,
  }));
}
