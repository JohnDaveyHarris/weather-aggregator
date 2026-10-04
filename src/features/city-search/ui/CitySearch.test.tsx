// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CitySearch } from "./CitySearch";
import { renderWithProviders } from "@/test/test-utils";
import { server } from "@/test/mocks/server";
import geocodingFixture from "@/entities/city/api/geocoding/fixtures/search.json";

const SEARCH_URL = "https://geocoding-api.open-meteo.com/v1/search";

describe("CitySearch", () => {
  it("ищет после debounce и выбирает город", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderWithProviders(<CitySearch onSelect={onSelect} />);

    await user.type(screen.getByPlaceholderText("Найти город…"), "Мос");

    // findBy ждёт до 1с — хватает на debounce (300мс) + мок-ответ
    expect(await screen.findByText("Москва")).toBeInTheDocument();

    await user.click(screen.getByText("Москва"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 524901, name: "Москва" }));
  });

  it("не отправляет запрос, пока введён 1 символ", async () => {
    let requestCount = 0;
    server.use(
      http.get(SEARCH_URL, () => {
        requestCount += 1;
        return HttpResponse.json(geocodingFixture);
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<CitySearch onSelect={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Найти город…"), "М");

    // ждём дольше debounce — счётчик запросов должен остаться нулевым
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(requestCount).toBe(0);
  });

  it("показывает «Ничего не найдено» на пустой результат", async () => {
    server.use(http.get(SEARCH_URL, () => HttpResponse.json({ generationtime_ms: 0.1 })));

    const user = userEvent.setup();
    renderWithProviders(<CitySearch onSelect={vi.fn()} />);
    await user.type(screen.getByPlaceholderText("Найти город…"), "Хрхр");

    expect(await screen.findByText("Ничего не найдено")).toBeInTheDocument();
  });
});
