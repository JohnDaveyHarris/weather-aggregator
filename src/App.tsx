import { useState } from "react";
import type { City } from "@/entities/city/model/types";
import { CitySearch } from "@/features/city-search/ui/CitySearch";
import { CurrentWeatherCard } from "@/widgets/current-weather/ui/CurrentWeatherCard";

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

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Погодный агрегатор</h1>
      <CitySearch onSelect={setCity} />
      <CurrentWeatherCard city={city} />
    </main>
  );
}

export default App;
