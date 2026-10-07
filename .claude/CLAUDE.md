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
npm run test          # vitest run — все тесты один раз
npm run test:watch    # vitest — перезапуск тестов при изменениях
```

Stop-хук `.claude/hooks/enforce-typecheck.sh` запускает `npm run typecheck` перед завершением ответа.

## Тесты

Vitest + Testing Library (jsdom). Запуск — `npm run test`, один файл — `npx vitest run src/tests/core/utils/jwt.test.ts`, по имени теста — `npx vitest run -t "Combobox"`. Конфиг — `vitest.config.ts`, он поверх `vite.config.ts`, поэтому в тестах работает алиас `@/`.

- Тесты лежат в `src/tests/` и повторяют структуру `src/` (`src/tests/core/utils/jwt.test.ts`, `src/tests/modules/orders/ordersApi.test.ts`), файлы — `*.test.ts` / `*.test.tsx`. На тестовый код действуют те же правила линтера, что и на основной.
- `src/tests/setup.ts` для всех тестов: подключает матчеры jest-dom, после каждого теста очищает DOM и `localStorage`, заменяет `mockRequest` версией без задержки в 400 мс (тест самого `mockRequest` возвращает настоящий через `vi.unmock`), подставляет `scrollIntoView`, которого нет в jsdom.
- Mock-таблицы и сторы живут в памяти модулей. Чтобы тесты не влияли друг на друга, тест, которому нужен «чистый бэкенд», вызывает `vi.resetModules()` и импортирует модули динамически: `loadFreshApis()` из `src/tests/helpers/loadModules.ts` для API, `await import(...)` для экранов и хуков. Так же проверяется «перезагрузка страницы»: данные пишутся в `localStorage`, модули загружаются заново.
- Хелперы в `src/tests/helpers/`: `renderWithRouter` (data router с заглушками страниц, чтобы проверить, куда ушёл пользователь), `RouterWrapper` для `renderHook`, `createTestToken` / `storeSession` для сессии, `normalizeSpaces` для сумм и дат из `Intl` (там неразрывные пробелы).
- Действия пользователя — через `@testing-library/user-event`, поиск элементов — по ролям и подписям (`getByRole("combobox", { name: "Клиент" })`), как их видит экранная читалка.

## Архитектура

Модифицированный MVVM с модульной структурой. Подробности — в `.claude/rules/architecture.md`, здесь только общая картина.

```
src/
├── app/       # маршруты: структура папок = структура URL
├── core/      # общая инфраструктура для всех модулей
└── modules/   # бизнес-модули: auth, dashboard, customers, products, orders
```

- `app/` — файловый роутинг по соглашениям Next.js: `page.tsx` — страница, `layout.tsx` — обёртка, `(group)` — группа без влияния на URL, `[param]` — динамический сегмент. Страницы — тонкие обёртки, которые рендерят экран из модуля; они загружаются по требованию (отдельный чанк на страницу), раскладки — сразу. Группа `(auth)` — публичные маршруты, `(protected)` — за `PrivateRoute`.
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

Типы запросов и ответов пишутся вручную в `model/types.ts` (`<Module>Request` / `<Module>Response`). Исходные mock-данные лежат в `model/mocks.ts`, а `model/<module>Api.ts` работает с ними асинхронными функциями. `viewModel/` и `view/` не знают, что бэкенда нет.

- «Таблицы» mock-API (`core/api/mockTable.ts`) сохраняются в `localStorage` под ключами `my-crm-mock:v<MOCK_STORAGE_VERSION>:<таблица>` (сейчас `v2`), так что изменения переживают перезагрузку. При загрузке они проверяются zod-схемой (`<entity>RecordSchema`); если данных нет или они не подходят, берутся исходные моки. Сохраняются таблицы, а не сторы.
- Страна клиента хранится кодом ISO 3166-1 (`countryCode: "RU"`), название показывается через `Intl.DisplayNames` (`core/utils/countries.ts`). Поиск по стране — по названию и по коду.
- Кнопки сброса данных в интерфейсе нет — как в рабочем приложении. Сброс — только для разработчика, см. «Сброс mock-данных» ниже.

#### Сброс mock-данных (для разработчика)

Изменения клиентов, товаров и заказов лежат в `localStorage`, поэтому новые или исправленные моки из `model/mocks.ts` не видны, пока сохранённые данные не сброшены. Два способа:

1. **Только у себя — через DevTools.** Application → Storage → Local Storage → `http://localhost:5173` → удалить ключи, начинающиеся с `my-crm-mock:` (сейчас `my-crm-mock:v2:customers`, `…:products`, `…:orders`), и перезагрузить страницу. Ключи `my-crm-session` и `my-crm-theme` не трогать — это вход и тема. То же из консоли: `Object.keys(localStorage).filter((key) => key.startsWith("my-crm-mock:")).forEach((key) => localStorage.removeItem(key)); location.reload();`
2. **У всех — повышением версии.** Увеличить `MOCK_STORAGE_VERSION` в `src/core/constants/mockStorage.ts` (например `2 → 3`). Таблицы начнут читаться из ключей `my-crm-mock:v3:…`, старые данные игнорируются, и у каждого, кто откроет приложение, загрузятся исходные моки. Так нужно делать, когда меняется форма сохраняемых данных или моки должны обновиться у всех. Ключи прежней версии останутся в браузере неиспользуемыми — их можно удалить вручную. История версий: `v1` — страна клиента названием, `v2` — кодом ISO 3166-1.

- Остатки товаров ведёт mock-API: создание заказа списывает остаток (больше, чем есть, заказать нельзя — ошибка у позиции и отказ API), отмена и удаление незакрытого заказа возвращают товар. Заказы вызывают «серверные» функции товаров через их `public/index.ts`, зависимость односторонняя.

### Авторизация

- Mock-вход (`modules/auth/model/authApi.ts`) возвращает пользователя и токен в формате JWT со сроком действия `exp`.
- `core/stores/sessionStore.ts` (zustand + `persist`) хранит токен и пользователя, предоставляет `logout`.
- `core/routes/PrivateRoute.tsx` пускает на защищённые страницы только с токеном. Срок действия проверяется при восстановлении сессии, при каждом переходе и по таймеру в момент истечения; истёкший токен — `logout` и редирект на `/login`.
- `core/routes/GuestRoute.tsx` перенаправляет вошедшего пользователя с `/login` на `/`.
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
