import { useState } from "react";
import type { City } from "@/entities/city/model/types";
import { CitySearch } from "@/features/city-search/ui/CitySearch";
import {WeatherOverview} from "@/widgets/weather-overview/ui/WeatherOverview.tsx";


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
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Погода-агрегатор</h1>
      <CitySearch onSelect={setCity} />
      <WeatherOverview city={city} />
    </main>
  );
}

export default App;
