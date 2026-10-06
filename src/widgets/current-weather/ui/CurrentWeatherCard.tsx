import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { City } from "@/entities/city/model/types";
import type { WeatherCondition } from "@/entities/weather/model/types";
import type { ProviderState } from "@/entities/weather/model/useAllWeather";
import { FavoriteToggle } from "@/features/favorites/ui/FavoriteToggle.tsx";

const conditionMeta: Record<WeatherCondition, { icon: string; label: string }> = {
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
  state: ProviderState;
}

export function CurrentWeatherCard({ city, state }: CurrentWeatherCardProps) {
  const { report, isLoading, isError } = state;

  if (isLoading) return <LoadingCard />;
  if (isError || !report) return <ErrorCard label={state.label} onRetry={state.refetch} />;

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
        <CardAction>
          <FavoriteToggle city={city} />
        </CardAction>
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
            <dd className="font-medium">{current.windSpeedMs.toFixed(1)} м/с</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Влажность</dt>
            <dd className="font-medium">{current.humidityPct}%</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Давление</dt>
            <dd className="font-medium">{Math.round(current.pressureHpa * 0.75006)} мм рт. ст.</dd>
          </div>
        </dl>

        <div className="grid grid-cols-7 gap-1 border-t pt-4">
          {report.daily.map((day) => {
            const dayMeta = conditionMeta[day.condition];
            return (
              <div key={day.date} className="flex flex-col items-center gap-1 text-center">
                <span className="text-xs text-muted-foreground">{formatWeekday(day.date)}</span>
                <span>{dayMeta.icon}</span>
                <span className="text-xs font-medium">
                  {Math.round(day.tempMaxC)}°
                  <span className="text-muted-foreground"> {Math.round(day.tempMinC)}°</span>
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

function ErrorCard({ label, onRetry }: { label: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="space-y-3 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          {label}: не удалось загрузить погоду. Проверь соединение и попробуй ещё раз.
        </p>
        <Button variant="outline" onClick={onRetry}>
          Повторить
        </Button>
      </CardContent>
    </Card>
  );
}
