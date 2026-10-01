# Нейминг файлов и папок

Структурные правила см. в `architecture.md` — здесь только про имена.

## Название модуля

Всегда с маленькой буквы, camelCase если из нескольких слов.

- ✅ `auth`, `userProfile`, `shoppingCart`
- ❌ `Auth`, `user-profile`, `UserProfile`

## Файлы внутри `model/`

Паттерн `<moduleName><Suffix>.ts`:

- ✅ `authApi.ts`, `authTypes.ts`, `authConstants.ts`, `authSchema.ts`,
  `authStore.ts`
- ❌ `api.ts` (если в папке есть другие похожие файлы и без имени
  модуля неясно, о чём файл), `Auth-Api.ts`, `authapi.ts`

Исключение: если у файла типовое общее имя без привязки к конкретному
модулю (контекст и так ясен из пути — например единственный файл
такого назначения в `model/`) — допустимо называть его одним словом с
маленькой буквы: `types.ts`, `constants.ts`, `schema.ts`.

## Файлы внутри `viewModel/`

Жёсткого паттерна нет — называются по смыслу того, что они делают,
camelCase:

- ✅ `useAuth.ts`, `useLoginForm.ts`, `useTodoFilters.ts`
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
