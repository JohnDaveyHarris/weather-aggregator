import { Badge } from "@/components/ui/badge";
import { computeTempSpread } from "@/entities/weather/model/spread";
import type { ProviderState } from "@/entities/weather/model/useAllWeather";

export function SpreadBadge({ states }: { states: ProviderState[] }) {
  const reports = states.flatMap((s) => (s.report ? [s.report] : []));
  const spread = computeTempSpread(reports);

  if (!spread) return null;

  return (
    <Badge variant="secondary" className="font-normal">
      Разброс: {spread.minC.toFixed(1)}…{spread.maxC.toFixed(1)} °C
    </Badge>
  );
}