# Нейминг файлов и папок

Структурные правила см. в `architecture.md` — здесь только про имена.

## Название модуля

Всегда с маленькой буквы, camelCase если из нескольких слов.

- ✅ `auth`, `customers`, `orderHistory`
- ❌ `Auth`, `order-history`, `OrderHistory`

## Файлы и папки внутри `app/`

Имена здесь задаёт файловый роутинг (см. `architecture.md`), поэтому
правило "имя файла = имя экспорта" на `app/` не распространяется.

- Файл страницы — всегда `page.tsx`, экспорт — `Page`.
- Файл обёртки — всегда `layout.tsx`, экспорт — `Layout`.
- Папка-сегмент URL — в нижнем регистре, kebab-case, если слов
  несколько: `customers`, `order-history`.
- Группа маршрутов — в круглых скобках: `(auth)`, `(protected)`.
- Динамический сегмент — в квадратных скобках, внутри camelCase:
  `[customerId]`, `[orderId]`.

- ✅ `app/(protected)/customers/[customerId]/page.tsx` →
  `export const Page`
- ❌ `CustomerPage.tsx`, `customers/index.tsx`, `[customer-id]/`,
  `export default function Page()`

## Файлы внутри `model/`

Типовые файлы называются одним словом с маленькой буквы — модуль и так
ясен из пути:

- ✅ `types.ts`, `constants.ts`, `schema.ts`, `mocks.ts`, `mappers.ts`
- ❌ `authTypes.ts`, `authConstants.ts`, `authSchema.ts`

Файл запросов и стор — с именем модуля, паттерн
`<moduleName><Suffix>.ts`:

- ✅ `authApi.ts`, `customersApi.ts`, `ordersStore.ts`
- ❌ `api.ts`, `store.ts`, `Auth-Api.ts`, `authapi.ts`

## Файлы внутри `viewModel/`

Жёсткого паттерна нет — называются по смыслу того, что они делают,
camelCase:

- ✅ `useLoginForm.ts`, `useCustomersList.ts`, `useOrderFilters.ts`
- ❌ `hook1.ts`, `logic.ts`, `AuthViewModel.ts`

## Экраны и компоненты (`view/screens/*`, `view/components/*`)

Каждый — в своей папке PascalCase, имя папки = имя файла = имя
экспорта:

- ✅ папка `LoginScreen/` → `LoginScreen.tsx` → `LoginScreen.styles.ts`
  → `export const LoginScreen`
- ❌ `login-screen/`, `loginScreen.tsx`, `export default function
LoginScreen()`

Компоненты из `core/ui/` называются и раскладываются по тому же
принципу: `Button/Button.tsx` + `Button.styles.ts`,
`export const Button`.

Всегда именованный экспорт (`export const`), без `default` — см.
подробнее `imports-exports.md`.

## Экспорт наружу модуля

Только через `public/index.ts`, именованные экспорты без `default`.

- ✅ `export { LoginScreen } from "../view/screens/LoginScreen/LoginScreen";`
- ❌ `export default LoginScreen;`, прямой импорт из другого модуля
  вида `import { LoginScreen } from "@/modules/auth/view/screens/LoginScreen/LoginScreen"`
