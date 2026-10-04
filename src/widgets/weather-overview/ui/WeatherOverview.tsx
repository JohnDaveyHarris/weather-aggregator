import { useState } from "react";
import type { City } from "@/entities/city/model/types";
import type { ProviderId } from "@/entities/weather/model/types";
import { useAllWeather, type ProviderState } from "@/entities/weather/model/useAllWeather";
import { CurrentWeatherCard } from "@/widgets/current-weather/ui/CurrentWeatherCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForecastComparisonChart } from "./ForecastComparisonChart";
import { SpreadBadge } from "./SpreadBadge";

export function WeatherOverview({ city }: { city: City }) {
  const coords = { lat: city.latitude, lon: city.longitude };
  const states = useAllWeather(coords);
  const [providerId, setProviderId] = useState<ProviderId>("open-meteo");

  const selected: ProviderState = states.find((s) => s.providerId === providerId) ?? states[0];
  const series = states.flatMap((s) =>
    s.report ? [{ providerId: s.providerId, report: s.report }] : [],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs value={providerId} onValueChange={(v) => setProviderId(v as ProviderId)}>
          <TabsList>
            {states.map((s) => (
              <TabsTrigger key={s.providerId} value={s.providerId}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <SpreadBadge states={states} />
      </div>

      <CurrentWeatherCard city={city} state={selected} />

      {series.length > 0 && <ForecastComparisonChart series={series} />}
    </section>
  );
}
