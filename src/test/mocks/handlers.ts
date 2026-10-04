import { http, HttpResponse } from "msw";
import openMeteoFixture from "@/entities/weather/api/open-meteo/fixtures/forecast.json";
import owmCurrentFixture from "@/entities/weather/api/open-weather-map/fixtures/current.json";
import owmForecastFixture from "@/entities/weather/api/open-weather-map/fixtures/forecast.json";
import weatherApiFixture from "@/entities/weather/api/weather-api/fixtures/forecast.json";
import geocodingFixture from "@/entities/city/api/geocoding/fixtures/search.json";

export const handlers = [
  http.get("https://geocoding-api.open-meteo.com/v1/search", () =>
    HttpResponse.json(geocodingFixture),
  ),
  http.get("https://api.open-meteo.com/v1/forecast", () => HttpResponse.json(openMeteoFixture)),
  http.get("https://api.openweathermap.org/data/2.5/weather", () =>
    HttpResponse.json(owmCurrentFixture),
  ),
  http.get("https://api.openweathermap.org/data/2.5/forecast", () =>
    HttpResponse.json(owmForecastFixture),
  ),
  http.get("https://api.weatherapi.com/v1/forecast.json", () =>
    HttpResponse.json(weatherApiFixture),
  ),
];
