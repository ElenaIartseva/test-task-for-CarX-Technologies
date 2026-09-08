# test task for CarX Technologies

Личный кабинет пользователя с функцией связи с технической поддержкой.

## Demo

https://elenaustimenko.github.io/test-task-for-CarX-Technologies/

**Учётные данные:** `admin` / `admin`

## Stack

- React 18 + TypeScript
- React Router 6
- Vite 5
- Vitest
- Playwright (E2E)
- SCSS Modules

## Требования

- Node.js >= 20

## Запуск локально

```bash
npm install
cp .env.example .env   # при необходимости измените VITE_BASE_PATH
npm run dev
```

Приложение откроется на [http://localhost:5173/test-task-for-CarX-Technologies/](http://localhost:5173/test-task-for-CarX-Technologies/).

## Конфигурация

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `VITE_BASE_PATH` | Base path для роутера и деплоя | `/test-task-for-CarX-Technologies/` |

Файл `.env.example` — шаблон для локальной разработки.

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер (Vite) |
| `npm start` | Alias для `npm run dev` |
| `npm run build` | Production-сборка в `dist/` |
| `npm run preview` | Просмотр production-сборки |
| `npm run typecheck` | Проверка типов TypeScript |
| `npm test` | Запуск unit-тестов (Vitest) |
| `npm run test:coverage` | Тесты с отчётом покрытия |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run test:e2e` | E2E-тесты (Playwright) |
| `npm run lint` | ESLint |
| `npm run fix` | Prettier |
| `npm run deploy` | Ручной деплой на GitHub Pages (`gh-pages`) |

## CI / CD

- **CI** (`.github/workflows/ci.yml`) — typecheck, lint, unit-тесты с coverage (порог 70%), сборка и E2E при каждом push и pull request.
- **Deploy** (`.github/workflows/deploy.yml`) — автоматический деплой на GitHub Pages при push в `main`.

## Git hooks

Husky + lint-staged запускают ESLint и Prettier для изменённых `.ts`/`.tsx` файлов перед коммитом.

## Функциональность

- **Авторизация** — вход по demo-учётным данным, выход из аккаунта
- **Главная** — создание обращений с темой, текстом и файлами (до 5 шт.)
- **Тикет** — просмотр обращения, комментарии, закрытие, скачивание файлов
- **404** — страница для несуществующих маршрутов

## Ограничения

- Данные хранятся в `localStorage` браузера (без backend)
- Файлы сохраняются как Base64 (до 2 МБ каждый) — при большом объёме возможен перегруз `localStorage`
- Учётные данные захардкожены для demo-режима

## Структура

```
src/
  components/     — UI-компоненты
  contexts/       — Auth, Notification, Tickets
  hooks/          — useValidation
  types/          — общие TypeScript-типы
  utils/          — constants, storage helpers
e2e/              — Playwright E2E-тесты
.github/workflows/  — CI и deploy pipelines
```
