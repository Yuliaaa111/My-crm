# CLAUDE.md

Этот файл — инструкция для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Команды

```bash
npm run dev          # запустить dev-сервер Vite
npm run build         # api:types -> typecheck -> vite build
npm run typecheck     # tsc --noEmit
npm run lint          # eslint .
npm run lint:fix      # eslint . --fix
npm run format        # prettier . --check
npm run format:write  # prettier . --write
npm run fix           # lint:fix + format:write
npm run api:types     # перегенерировать src/core/api/generated.ts из живой OpenAPI-схемы бэкенда
```

В проекте не настроен тест-раннер (нет ни test-скрипта, ни тестовых файлов).

Pre-commit хук (husky) запускает `lint-staged`: `eslint --fix` для `*.{ts,tsx}`, `prettier --write` для `*.{json,md,yml,yaml,css,scss}`.

## API-типы

`src/core/api/generated.ts` — сгенерированный файл, руками его не редактировать. Чтобы обновить — `npm run api:types`: скрипт скачивает генератор с `${API_BASE_URL}/api-types-generator.ts` (`API_BASE_URL` берётся из `.env`, см. `.env.example`) и запускает его локально. `npm run build` всегда сначала перегенерирует типы, так что сборка отражает то, что бэкенд отдаёт прямо сейчас.

В `model/types.ts` каждой фичи типы запроса/ответа реэкспортируются напрямую из generated (например `export type { LoginCredentials, ... } from "@/core/api/generated"`), а не описываются вручную — для новых эндпойнтов нужно следовать этому же паттерну.

## Архитектура

Модульная структура по фичам:

- `app/` — только роутинг (`app/index.tsx` — `AppRouter`) и тонкие страницы в `app/pages/(auth)/` (публичные) и `app/pages/(protected)/` (за `PrivateRoute`). Страницы — это обёртки, которые просто рендерят виджет из `features/`.
- `core/` — сквозные вещи, общие для всех фич: инстанс axios + интерсепторы (`core/api/axiosConfig.ts`), сгенерированные API-типы (`core/api/generated.ts`), каркас приложения (`core/layouts/AppLayout`), жизненный цикл инициализации приложения (`core/providers/AppInitializationProvider.tsx`, `core/hooks/useAppInitialization.ts`, `core/stores/appInitializationStore.ts`), гард роутов (`core/routes/PrivateRoute.tsx`), i18n (`core/locales/`), типы темы (`core/types.ts`) и общие UI-компоненты (`core/shared/components`).
- `features/<Feature>/` — бизнес-фичи (сейчас `Auth`, `Todos`):
  - `model/` — `types.ts`, `schema.ts` (zod), `constants.ts` (конфиги полей), `<feature>Api.ts` (axios-запросы), `<feature>Store.ts` (zustand-стор)
  - `hooks/` — хуки фичи, которые оркеструют вызовы API + локальное UI-состояние (loading/error/success) и дёргают zustand-стор
  - `widgets/` — UI фичи, общие куски вынесены в `widgets/components/`

### Auth-флоу

- `authStore.ts` (zustand + `persist`, в storage персистятся только `accessToken`/`refreshToken`) владеет `login`/`register`/`logout` и состоянием сессии (`user`, `isAuthenticated`).
- `axiosConfig.ts` подставляет bearer-токен в каждый запрос и при 401 прозрачно дёргает `/auth/refresh`, повторяет исходный запрос один раз (отслеживается через `WeakSet`, чтобы не уйти в бесконечный retry), обновляет стор — а если рефреш не удался, делает `logout()`.
- При старте приложения (`useAppInitialization`) при наличии токенов вызывается `GET /me`, чтобы восстановить пользователя до рендера защищённых роутов; `AppInitializationProvider`/`appInitializationStore` блокируют рендер, пока это (и любые другие зарегистрированные init-эффекты) не завершится.
- Auth-страницы, не меняющие состояние сессии (forgot/reset password), вызывают API напрямую из хука фичи, минуя zustand-стор — стор нужен только для флоу, которые создают/завершают сессию.
- Auth-виджеты переиспользуют `AuthSection`/`AuthForm`/`InfoSection` (`widgets/components/`). Списки полей (`AuthField<T>[]`) и zod-схемы объявляются один раз в `model/constants.ts`/`model/schema.ts` и передаются в `AuthForm`, который сам разруливает `react-hook-form` + `zodResolver` + лоадер на кнопке сабмита — новые auth-формы должны следовать этому же паттерну (fields + schema + widget), а не собираться с нуля.

### Стили

На Emotion, завязаны на тему: модуль стилей экспортирует функцию `(theme: AppTheme, ...args) => StyleConfig`, обёрнутую в `stylesConfiguratorHook` (`core/hooks/useStylesConfigurator.ts`), которая мемоизирует результат по текущей теме. В компонентах используется так: `const styles = useStyles(); <div className={css(styles.foo)} />`.

## Правила линтера, которые важно знать до написания кода

- Тайп-ассершены и `any`/`unknown` запрещены через `no-restricted-syntax` в `eslint.config.ts` (`as`, `<Type>`, `any`, `unknown` — всё ошибка) — вместо этого используйте конкретные типы, расширяя при необходимости сгенерированные API-типы.
- Порядок импортов задаётся `simple-import-sort`: сначала внешние пакеты, затем через пустую строку группа `@/...`/относительных импортов, затем последняя группа для импортов `*.styles`/css.
- Неиспользуемые импорты — ошибка (`unused-imports/no-unused-imports`); неиспользуемые переменные/аргументы — предупреждение, если не начинаются с `_`.

## Git-флоу (из README)

`main` и `develop` защищены — коммитить туда напрямую нельзя. На каждую задачу — ветка от `develop` (например `feature/task1`), затем PR обратно в `develop`:

```bash
git checkout develop
git pull
git checkout -b feature/task1
```

## Правила проекта

Подробные правила лежат в `.claude/rules/` (подгружаются в контекст
автоматически при старте каждой сессии):

- `architecture.md` — целевая структура проекта, модифицированная MVVM (`model` / `viewModel` / `view` / `public`)
- `naming-conventions.md` — нейминг файлов, папок, модулей, экранов и компонентов
- `code-conventions.md` — стиль кода: функции, типы, переменные, константы, комментарии
- `imports-exports.md` — порядок импортов, алиасы, именованные экспорты без `default`
- `safety-rules.md` — что запрещено делать без явного подтверждения (удаление, `.env`, git commit/push/PR, план перед задачей)
- `package-docs-verification.md` — не выдумывать API пакетов, сверяться с реальной документацией и версией

Раздел "Архитектура" выше в этом файле описывает **текущую** структуру
кода (`features/`, `widgets/`, `hooks/`); `architecture.md` в
`.claude/rules/` описывает **целевую** структуру (`modules/` с
`model/viewModel/view/public`), к которой следует стремиться в новом и
рефакторимом коде — см. также список расхождений между ними, который
поддерживается отдельно по ходу работы.
