import { http, HttpResponse } from "msw";
import openMeteoFixture from "@/entities/weather/api/open-meteo/fixtures/forecast.json";
import owmCurrentFixture from "@/entities/weather/api/open-weather-map/fixtures/current.json";
import owmForecastFixture from "@/entities/weather/api/open-weather-map/fixtures/forecast.json";
import weatherApiFixture from "@/entities/weather/api/weather-api/fixtures/forecast.json";
import geocodingFixture from "@/entities/city/api/geocoding/fixtures/search.json";
import { apiUrl } from "@/shared/lib/api-url.ts";

export const handlers = [
  http.get("https://geocoding-api.open-meteo.com/v1/search", () =>
    HttpResponse.json(geocodingFixture),
  ),
  http.get(apiUrl("/api/open-meteo/v1/forecast"), () => HttpResponse.json(openMeteoFixture)),
  http.get(apiUrl("/api/open-weather-map/weather"), () => HttpResponse.json(owmCurrentFixture)),
  http.get(apiUrl("/api/open-weather-map/forecast"), () => HttpResponse.json(owmForecastFixture)),
  http.get(apiUrl("/api/weatherapi/forecast"), () => HttpResponse.json(weatherApiFixture)),
];
