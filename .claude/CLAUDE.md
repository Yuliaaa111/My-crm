# CLAUDE.md

Этот файл — инструкция для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## О проекте

My CRM — упрощённая CRM на React 19 + Vite + TypeScript: вход, сводка, клиенты, товары, заказы. Корзины, оплаты и доставки нет. Бэкенда нет — все данные на моках.

Проект в самом начале: в `src/` пока лежит стандартный шаблон Vite (`App.tsx`, `main.tsx`), описанная ниже структура ещё не создана. Новый код пишется сразу по этой архитектуре.

## Команды

```bash
npm run dev      # запустить dev-сервер Vite
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # посмотреть собранную версию
```

Других скриптов в `package.json` пока нет. Тест-раннер не настроен (нет ни test-скрипта, ни тестовых файлов).

## Архитектура

Модифицированный MVVM с модульной структурой. Подробности — в `.claude/rules/architecture.md`, здесь только общая картина.

```
src/
├── app/       # маршруты: структура папок = структура URL
├── core/      # общая инфраструктура для всех модулей
└── modules/   # бизнес-модули: auth, dashboard, customers, products, orders
```

- `app/` — файловый роутинг по соглашениям Next.js: `page.tsx` — страница, `layout.tsx` — обёртка, `(group)` — группа без влияния на URL, `[param]` — динамический сегмент. Страницы — тонкие обёртки, которые рендерят экран из модуля. Группа `(auth)` — публичные маршруты, `(protected)` — за `PrivateRoute`.
- `core/` — запросы (`api/`), ассеты (`assets/`), глобальные сторы (`stores/`), гард маршрутов (`routes/`), провайдеры (`providers/`), UI-компоненты (`ui/`), стили, типы, константы, утилиты. `core` ничего не импортирует из `modules/`.
- `modules/<moduleName>/` — один бизнес-модуль. Наружу отдаёт только то, что экспортировано из `public/index.ts`.

### Где Model, ViewModel и View

| Слой      | Папка модуля | Что содержит                                                                                |
| --------- | ------------ | ------------------------------------------------------------------------------------------- |
| Model     | `model/`     | `types.ts`, `constants.ts`, `schema.ts` (zod), `mocks.ts`, `<module>Api.ts`, `<module>Store.ts` |
| ViewModel | `viewModel/` | хуки: вызывают запросы и сторы, держат состояние экрана, формы и обработчики; без JSX       |
| View      | `view/`      | `screens/` и `components/`: рендерят то, что вернул хук; без прямых запросов и сторов       |

Зависимости идут в одну сторону: `view → viewModel → model`.

### Модули и маршруты

| Модуль      | Маршруты                               |
| ----------- | -------------------------------------- |
| `auth`      | `/login`                               |
| `dashboard` | `/`                                    |
| `customers` | `/customers`, `/customers/:customerId` |
| `products`  | `/products`, `/products/:productId`    |
| `orders`    | `/orders`, `/orders/:orderId`          |

### Данные

Типы запросов и ответов пишутся вручную в `model/types.ts` (`<Module>Request` / `<Module>Response`). Mock-данные лежат в `model/mocks.ts`, а `model/<module>Api.ts` отдаёт их асинхронными функциями. `viewModel/` и `view/` не знают, что бэкенда нет.

### Авторизация

- Mock-вход (`modules/auth/model/authApi.ts`) возвращает пользователя и токен в формате JWT со сроком действия `exp`.
- `core/stores/sessionStore.ts` (zustand + `persist`) хранит токен и пользователя, предоставляет `logout`.
- `core/routes/PrivateRoute.tsx` проверяет наличие токена и срок его действия; если токена нет или срок истёк — `logout` и редирект на `/login`.
- В `auth` только вход: регистрации и восстановления пароля нет.

### Тема и стили

- Стили — на Emotion: рядом с компонентом лежит `<Name>.styles.ts` с функцией `styles(theme, ...)` и хуком `useStyles`, созданным через `stylesConfiguratorHook` из `core/styles/`.
- Тема светлая/тёмная: режим хранится в `core/stores/themeStore.ts` (zustand + `persist`), `core/providers/ThemeProviderManager.tsx` передаёт тему в Emotion.

## Ключевые правила кода

- Только `type`, без `interface` и `enum`.
- `any` и `satisfies` запрещены. `as` запрещён полностью, включая `as const` — для констант используется явный тип.
- `unknown` разрешён только с последующей проверкой типа.
- Только именованные экспорты. `export default` — исключительно в конфигах в корне проекта.
- Формы — `react-hook-form`, валидация — `zod`.

## Ещё не настроено

Правила ниже описаны в `.claude/rules/`, но в проекте пока не работают. Это отдельная задача через скилл `setup-tooling`, в таком порядке:

1. `.env` не добавлен в `.gitignore`, файла `.env.example` нет.
2. Нет скрипта `typecheck`. Stop-хук `enforce-typecheck.sh` из-за этого запускает `tsc --noEmit`, который при текущем `tsconfig.json` не проверяет ни одного файла из `src/`.
3. Линтер — стандартный из шаблона Vite (`eslint.config.js`): запреты на `as`, `any`, `interface`, порядок импортов и неиспользуемые импорты не проверяются. Prettier, husky и lint-staged не установлены.
4. Алиас `@/` не настроен ни в tsconfig, ни в `vite.config.ts`.

Библиотеки, на которые опирается архитектура, тоже ещё не установлены: `react-router-dom`, `zustand`, `@emotion/react`, `react-hook-form`, `zod`. Перед установкой и использованием сверяться с документацией актуальной версии (см. `package-docs-verification.md`).

## Git-флоу

```
main ← develop ← feature/*
```

- `main` — стабильная версия. Напрямую в `main` не коммитим, туда попадает только `develop`.
- `develop` — основная ветка разработки.
- На каждую задачу — ветка `feature/<task-name>` от `develop`; после завершения она вливается обратно в `develop`.

```bash
git checkout develop
git pull
git checkout -b feature/task-name
```

Коммит, push и слияние — только по прямой просьбе пользователя (см. `safety-rules.md`). Коммиты оформляются через скилл `commit`.

## Правила проекта

Подробные правила лежат в `.claude/rules/` (подгружаются в контекст автоматически при старте каждой сессии):

- `architecture.md` — структура проекта, MVVM (`model` / `viewModel` / `view` / `public`), файловый роутинг, моки, сессия, тема
- `naming-conventions.md` — нейминг файлов, папок, модулей, маршрутов, экранов и компонентов
- `code-conventions.md` — стиль кода: функции, типы, переменные, константы, комментарии
- `imports-exports.md` — порядок импортов, алиасы, именованные экспорты без `default`
- `safety-rules.md` — что запрещено делать без явного подтверждения (удаление, `.env`, git commit/push/PR, план перед задачей)
- `package-docs-verification.md` — не выдумывать API пакетов, сверяться с реальной документацией и версией
