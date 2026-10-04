import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/app/store";

interface Params extends Omit<RenderOptions, "wrapper"> {
  store?: AppStore;
}

/** Рендерит UI внутри Provider со свежим стором; возвращает стор для ассертов */
export function renderWithProviders(
  ui: ReactElement,
  { store, ...options }: Params = {},
) {
  const finalStore = store ?? makeStore();

  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={finalStore}>{children}</Provider>;
  }

  return { store: finalStore, ...render(ui, { wrapper: Wrapper, ...options }) };
}