import type { WeatherCondition } from "../../model/types";

/**
 * Таблица кодов: https://www.weatherapi.com/docs/ (Weather Conditions JSON).
 * Грань «дождь / мокрый снег» условна - выбранное поведение зафиксировано тестами.
 */
const THUNDERSTORM = new Set([1087, 1273, 1276, 1279, 1282]);
const FOG = new Set([1030, 1135, 1147]);
const SNOW = new Set([
  1066, 1069, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219,
  1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264,
]);
const RAIN = new Set([
  1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189,
  1192, 1195, 1198, 1201, 1240, 1243, 1246,
]);

export function mapWeatherApiCodeToCondition(code: number): WeatherCondition {
  if (code === 1000) return "clear";
  if (code === 1003) return "partly-cloudy";
  if (THUNDERSTORM.has(code)) return "thunderstorm";
  if (FOG.has(code)) return "fog";
  if (SNOW.has(code)) return "snow";
  if (RAIN.has(code)) return "rain";
  return "cloudy"; // 1006, 1009 и прочие
}