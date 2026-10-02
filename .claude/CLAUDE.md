# CLAUDE.md

Этот файл — инструкция для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## О проекте

My CRM — упрощённая CRM на React 19 + Vite + TypeScript: вход, сводка, клиенты, товары, заказы. Корзины, оплаты и доставки нет. Бэкенда нет — все данные на моках.

Код пишется по этапам: план и его состояние — в `.claude/plans/crm-implementation.md`. Часть модулей может быть ещё не реализована — их страницы показывают заглушку.

## Команды

```bash
npm run dev           # запустить dev-сервер Vite
npm run build         # tsc -b && vite build
npm run preview       # посмотреть собранную версию
npm run typecheck     # tsc -b
npm run lint          # eslint .
npm run lint:fix      # eslint . --fix
npm run format        # prettier . --check
npm run format:write  # prettier . --write
npm run fix           # lint:fix + format:write
```

Тест-раннер пока не настроен (появится на последнем этапе плана). Stop-хук `.claude/hooks/enforce-typecheck.sh` запускает `npm run typecheck` перед завершением ответа.

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

| Слой      | Папка модуля | Что содержит                                                                                    |
| --------- | ------------ | ----------------------------------------------------------------------------------------------- |
| Model     | `model/`     | `types.ts`, `constants.ts`, `schema.ts` (zod), `mocks.ts`, `<module>Api.ts`, `<module>Store.ts` |
| ViewModel | `viewModel/` | хуки: вызывают запросы и сторы, держат состояние экрана, формы и обработчики; без JSX           |
| View      | `view/`      | `screens/` и `components/`: рендерят то, что вернул хук; без прямых запросов и сторов           |

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

- Стили — на `@emotion/css`: рядом с компонентом лежит `<Name>.styles.ts` с функцией `styles(theme, ...)` и хуком `useStyles`, созданным через `stylesConfiguratorHook` из `core/styles/`. В компоненте: `const styles = useStyles(); <div className={css(styles.root)} />`.
- Тема светлая/тёмная: режим хранится в `core/stores/themeStore.ts` (zustand + `persist`), `core/providers/ThemeProviderManager.tsx` собирает тему и отдаёт её через собственный React-контекст; читается хуком `useAppTheme` из `core/hooks/`. `@emotion/react` не используется.

## Ключевые правила кода

- Только `type`, без `interface` и `enum`.
- `any` и `satisfies` запрещены.
- `as const` разрешён. Обычный `as` — только там, где тип известен точно, а TypeScript не может его вывести, и обязательно с комментарием рядом, почему это безопасно. `as any`, `as unknown as X` и `as` ради того, чтобы заглушить ошибку типов, запрещены. Где возможно — zod или type guard вместо `as`.
- `unknown` разрешён только с последующей проверкой типа.
- Только именованные экспорты. `export default` — исключительно в конфигах в корне проекта.
- Формы — `react-hook-form`, валидация — `zod`.

## Линтер и форматирование

`eslint.config.ts` проверяет правила проекта автоматически:

- запрещённый синтаксис: `any`, `interface`, `enum`, `satisfies`, двойное приведение типов, `<Type>value`; внутри `src/` — ещё и `export default`;
- `local/commented-type-assertion` — собственное правило: обычный `as` без комментария на той же или предыдущей строке — ошибка;
- порядок импортов (`simple-import-sort`): пакеты → `@/` и относительные → стили;
- неиспользуемые импорты — ошибка; неиспользуемые переменные — предупреждение, если имя не начинается с `_`;
- форматирование Prettier — как ошибка линтера.

Папка `.claude/` линтером не проверяется. Вместо `eslint-plugin-import` стоит `eslint-plugin-import-x`, `eslint-plugin-react` не установлен — оба оригинальных плагина не поддерживают ESLint 10.

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
