import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildComparisonRows, type ProviderSeries } from "@/entities/weather/model/comparison";
import { PROVIDER_COLORS, PROVIDER_LABELS } from "@/entities/weather/model/providers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function formatTick(date: string): string {
  // полдень в дате — чтобы день недели не «съезжал» из-за пояса
  return new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function ForecastComparisonChart({ series }: { series: ProviderSeries[] }) {
  if (series.length === 0) return null;

  const rows = buildComparisonRows(series);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Прогноз макс. температуры по источникам</CardTitle>
        <CardDescription>
          Модели прогноза расходятся на 1-3 °C - в этом и смысл агрегатора
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatTick} fontSize={12} tickLine={false} />
              <YAxis
                width={36}
                fontSize={12}
                tickLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(v) => `${Math.round(Number(v))}°`}
              />
              <Tooltip
                labelFormatter={(label) => formatTick(String(label))}
                formatter={(value) => `${value} °C`}
              />
              <Legend />
              {series.map((s) => (
                <Line
                  key={s.providerId}
                  type="monotone"
                  dataKey={s.providerId}
                  name={PROVIDER_LABELS[s.providerId]}
                  stroke={PROVIDER_COLORS[s.providerId]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
