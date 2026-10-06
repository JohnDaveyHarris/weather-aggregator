/**
 * Собирает абсолютный same-origin URL для /api/*.
 *
 * В Node-тестах undici не умеет относительные URL - резолвим от origin jsdom.
 * В браузере результат - тот же origin, что и у страницы: поведение
 * (Vite-прокси в dev, rewrites/функции в проде) не меняется.
 */
export function apiUrl(path: string): string {
  const base =
    typeof location !== "undefined" ? location.href : "http://localhost:3000";
  return new URL(path, base).href;
}