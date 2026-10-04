// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeatherOverview } from "./WeatherOverview";
import { renderWithProviders } from "@/test/test-utils";
import { server } from "@/test/mocks/server";
import type { City } from "@/entities/city/model/types";

const city: City = {
  id: 524901,
  name: "Москва",
  country: "Россия",
  latitude: 55.75222,
  longitude: 37.61556,
};

describe("WeatherOverview", () => {
  it("показывает данные всех провайдеров и переключается по табам", async () => {
    vi.stubEnv("VITE_WEATHER_API_KEY", "test-key");
    const user = userEvent.setup();
    renderWithProviders(<WeatherOverview city={city} />);

    // открыт по умолчанию Open-Meteo
    expect(await screen.findByText("-4°")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "OpenWeatherMap" }));
    expect(await screen.findByText(/небольшой снег/)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "WeatherAPI.com" }));
    expect(await screen.findByText(/Умеренный снег/)).toBeInTheDocument();
  });

  it("считает разброс по всем трём источникам", async () => {
    vi.stubEnv("VITE_WEATHER_API_KEY", "test-key");
    renderWithProviders(<WeatherOverview city={city} />);

    // фикстуры: open-meteo -4.2, owm -4.5, weatherapi -3.9
    expect(await screen.findByText("Разброс: -4.5…-3.9 °C")).toBeInTheDocument();
    expect(screen.getByText(/Прогноз макс. температуры/)).toBeInTheDocument();
  });

  it("без ключа WeatherAPI — заглушка и разброс по двум", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WeatherOverview city={city} />);

    expect(await screen.findByText("Разброс: -4.5…-4.2 °C")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "WeatherAPI.com" }));
    expect(await screen.findByText(/источник не настроен/)).toBeInTheDocument();
  });

  it("ошибка одного источника не мешает другим", async () => {
    server.use(
      http.get("https://api.open-meteo.com/v1/forecast", () =>
        HttpResponse.json({ error: "boom" }, { status: 500 }),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<WeatherOverview city={city} />);

    expect(
      await screen.findByText(/не удалось загрузить погоду/),
    ).toBeInTheDocument();
    // один отчёт → разброса нет
    expect(screen.queryByText(/Разброс:/)).not.toBeInTheDocument();

    // а OWM при этом жив
    await user.click(screen.getByRole("tab", { name: "OpenWeatherMap" }));
    expect(await screen.findByText(/небольшой снег/)).toBeInTheDocument();
  });
});