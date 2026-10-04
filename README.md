# Weather Aggregator

Агрегатор погоды: запрашивает несколько источников (**Open-Meteo**, **OpenWeatherMap**, **WeatherAPI.com**), 
нормализует их к единой модели и показывает расхождения прогнозов.

[![CI](https://github.com/JohnDaveyHarris/weather-aggregator/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnDaveyHarris/weather-aggregator/actions/workflows/ci.yml)

## 🛠 Стек

- **React** + **TypeScript** + **Vite**
- **Redux Toolkit** + **RTK Query**
- **shadcn/ui** + **Tailwind CSS**
- **Vitest** + **Testing Library** + **MSW**
- **Recharts**

## ✨ Возможности

- 🔍 Поиск городов с debounce
- 🌤 Текущая погода и прогноз от каждого источника
- 📊 Сравнение источников: разброс температуры и наложенные графики прогнозов
- ⭐ Избранное с сохранением в `localStorage`
- 🛡 Изоляция ошибок: падение одного источника не влияет на остальные

## 📌 Статус

> 🚧 README наполняется: архитектура, схема данных и демо-ссылка — в финальной версии.