import { useState } from "react";
import type { City } from "@/entities/city/model/types";
import { CitySearch } from "@/features/city-search/ui/CitySearch";
import { CurrentWeatherCard } from "@/widgets/current-weather/ui/CurrentWeatherCard";
import type {ProviderId} from "@/entities/weather/model/types.ts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PROVIDERS: { id: ProviderId; label: string }[] = [
    { id: "open-meteo", label: "Open-Meteo" },
    { id: "open-weather-map", label: "OpenWeatherMap" },
];

const DEFAULT_CITY: City = {
  id: 524901,
  name: "Москва",
  country: "Россия",
  admin1: "Москва",
  latitude: 55.75222,
  longitude: 37.61556,
};

function App() {
  const [city, setCity] = useState<City>(DEFAULT_CITY);
  const [providerId, setProviderId] = useState<ProviderId>("open-meteo");

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Погода-агрегатор</h1>
      <CitySearch onSelect={setCity} />
      <Tabs value={providerId} onValueChange={(v) => setProviderId(v as ProviderId)}>
        <TabsList className="w-full">
          {PROVIDERS.map((p) => (
            <TabsTrigger key={p.id} value={p.id} className="flex-1">
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <CurrentWeatherCard city={city} providerId={providerId} />
    </main>
);
}

export default App;
