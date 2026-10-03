import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { City } from "@/entities/city/model/types";
import type { WeatherCondition } from "@/entities/weather/model/types";
import {openMeteoApi} from "@/entities/weather/api/open-meteo/open-meteo.api";
import type { ProviderId } from "@/entities/weather/model/types";
import {openWeatherMapApi} from "@/entities/weather/api/open-weather-map/open-weather-map.api.ts";
import {skipToken} from "@reduxjs/toolkit/query";

const conditionMeta: Record<WeatherCondition, { icon: string; label: string }> =
  {
    clear: { icon: "☀️", label: "Ясно" },
    "partly-cloudy": { icon: "⛅", label: "Переменная облачность" },
    cloudy: { icon: "☁️", label: "Пасмурно" },
    fog: { icon: "🌫️", label: "Туман" },
    rain: { icon: "🌧️", label: "Дождь" },
    snow: { icon: "❄️", label: "Снег" },
    thunderstorm: { icon: "⛈️", label: "Гроза" },
  };

interface CurrentWeatherCardProps {
  city: City;
  providerId: ProviderId;
}

export function CurrentWeatherCard({ city, providerId }: CurrentWeatherCardProps) {
  const coords = { lat: city.latitude, lon: city.longitude };

  const openMeteo = openMeteoApi.useGetWeatherQuery(
      providerId === "open-meteo" ? coords : skipToken,
  );
  const openWeatherMap = openWeatherMapApi.useGetWeatherQuery(
      providerId === "open-weather-map" ? coords : skipToken,
  );

  const active = providerId === "open-meteo" ? openMeteo : openWeatherMap;
  const { data: report, isLoading, isError, refetch } = active;

  if (isLoading) return <LoadingCard />;
  if (isError || !report) return <ErrorCard onRetry={refetch} />;

  const { current } = report;
  const meta = conditionMeta[current.condition];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {city.name}
          {city.country ? `, ${city.country}` : ""}
        </CardTitle>
        <CardDescription>
          {meta.icon} {current.description ?? meta.label}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-semibold tracking-tight">
            {Math.round(current.temperatureC)}°
          </span>
          <span className="text-sm text-muted-foreground">
            ощущается как {Math.round(current.feelsLikeC)}°
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Ветер</dt>
            <dd className="font-medium">
              {current.windSpeedMs.toFixed(1)} м/с
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Влажность</dt>
            <dd className="font-medium">{current.humidityPct}%</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Давление</dt>
            <dd className="font-medium">
              {Math.round(current.pressureHpa * 0.75006)} мм рт. ст.
            </dd>
          </div>
        </dl>

        <div className="grid grid-cols-7 gap-1 border-t pt-4">
          {report.daily.map((day) => {
            const dayMeta = conditionMeta[day.condition];
            return (
              <div
                key={day.date}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span className="text-xs text-muted-foreground">
                  {formatWeekday(day.date)}
                </span>
                <span>{dayMeta.icon}</span>
                <span className="text-xs font-medium">
                  {Math.round(day.tempMaxC)}°
                  <span className="text-muted-foreground">
                    {" "}
                    {Math.round(day.tempMinC)}°
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function formatWeekday(date: string): string {
  // "2025-01-15" + полдень парсится как локальное время,
  // так день недели не съедет из-за часового пояса
  return new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
    weekday: "short",
  });
}

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-2 h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="space-y-3 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Не удалось загрузить погоду. Проверьте соединение и попробуйте ещё раз.
        </p>
        <Button variant="outline" onClick={onRetry}>
          Повторить
        </Button>
      </CardContent>
    </Card>
  );
}
