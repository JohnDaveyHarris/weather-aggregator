// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { renderWithProviders } from "@/test/test-utils";
import { adaptOpenMeteo } from "@/entities/weather/api/open-meteo/adapter";
import fixture from "@/entities/weather/api/open-meteo/fixtures/forecast.json";
import type { OpenMeteoForecastResponse } from "@/entities/weather/api/open-meteo/types";
import type { City } from "@/entities/city/model/types";
import type { ProviderState } from "@/entities/weather/model/useAllWeather";

const city: City = {
  id: 524901,
  name: "Москва",
  country: "Россия",
  latitude: 55.75222,
  longitude: 37.61556,
};

const report = adaptOpenMeteo(fixture as OpenMeteoForecastResponse);

function makeState(overrides: Partial<ProviderState>): ProviderState {
  return {
    providerId: "open-meteo",
    label: "Open-Meteo",
    report: undefined,
    isLoading: false,
    isError: false,
    isUninitialized: false,
    refetch: vi.fn(),
    ...overrides,
  };
}

describe("CurrentWeatherCard", () => {
  it("рисует данные текущей погоды", () => {
    renderWithProviders(<CurrentWeatherCard city={city} state={makeState({ report })} />);

    expect(screen.getByText("-4°")).toBeInTheDocument(); // Math.round(-4.2)
    expect(screen.getByText(/ощущается как -9°/)).toBeInTheDocument();
    expect(screen.getByText("760 мм рт. ст.")).toBeInTheDocument(); // 1013.8 гПа
    expect(screen.getByText(/Снег/)).toBeInTheDocument(); // без description → meta.label
  });

  it("в состоянии загрузки не показывает данные", () => {
    renderWithProviders(<CurrentWeatherCard city={city} state={makeState({ isLoading: true })} />);
    expect(screen.queryByText("-4°")).not.toBeInTheDocument();
  });

  it("в состоянии ошибки предлагает повторить", async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    renderWithProviders(
      <CurrentWeatherCard city={city} state={makeState({ isError: true, refetch })} />,
    );

    await user.click(screen.getByRole("button", { name: "Повторить" }));
    expect(refetch).toHaveBeenCalledOnce();
  });

  it("звезда добавляет город в избранное", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <CurrentWeatherCard city={city} state={makeState({ report })} />,
    );

    await user.click(screen.getByRole("button", { name: "Добавить в избранное" }));

    expect(store.getState().favorites.cities).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Убрать из избранного" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
