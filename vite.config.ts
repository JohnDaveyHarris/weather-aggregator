/// <reference types="vitest/config" />
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // читаем и НЕ-VITE_ переменные тоже

  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    test: {
      environment: "node",
      include: ["src/**/*.test.{ts,tsx}"],
      setupFiles: ["src/test/setup.ts"],
    },
    server: {
      proxy: {
        "/api/open-meteo": {
          target: "https://api.open-meteo.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/open-meteo/, ""),
        },
        "/api/open-weather-map": {
          target: "https://api.openweathermap.org",
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, "http://local");
            url.searchParams.set("appid", env.OWM_API_KEY ?? "");
            url.pathname = url.pathname.replace(/^\/api\/open-weather-map/, "/data/2.5");
            return url.pathname + url.search;
          },
        },
        "/api/weatherapi": {
          target: "https://api.weatherapi.com",
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, "http://local");
            url.searchParams.set("key", env.WEATHER_API_KEY ?? "");
            // /api/weatherapi/forecast → /v1/forecast.json (у апстрима расширение в пути)
            url.pathname = url.pathname.replace(
                /^\/api\/weatherapi\/forecast$/,
                "/v1/forecast.json",
            );
            return url.pathname + url.search;
          },
        },
      },
    },
  };
});
