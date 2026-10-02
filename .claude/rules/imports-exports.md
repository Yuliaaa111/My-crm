# Импорты и экспорты

## Алиасы

- Между модулями, а также при обращении к `core/` — только абсолютные
  импорты через алиас `@/` (например `@/core/types`,
  `@/modules/auth/public`).
- Внутри одного модуля (между `model/`, `viewModel/`, `view/` этого же
  модуля, а также внутри одной папки компонента/экрана) — допустимы
  обычные относительные импорты (`./`, `../`), жёстко переходить на
  `@/` внутри модуля не обязательно.

## Порядок импортов

Импорты в каждом файле группируются в три блока, в этом порядке сверху
вниз, с пустой строкой между блоками:

1. **Пакеты** — импорты из `node_modules` (`react`, `zustand`,
   `react-hook-form`, `@emotion/css` и т.п.).
2. **Свои** — абсолютные импорты через `@/` (`core/`, другие модули
   через `public/index.ts`) и относительные импорты внутри модуля
   (`./`, `../`) — типы, константы, api, хуки, компоненты.
3. **Стили** — импорт `*.styles.ts` (`useStyles`) текущего
   компонента/экрана — всегда последним.

Внутри второго блока порядок не принципиален, но желательно от более
общего к более специфичному (сначала `@/core/...`, затем импорты из
других модулей через `public/index.ts`, затем локальные относительные
импорты внутри своего модуля).

```ts
// ✅
import { useMemo } from "react";
import { create } from "zustand";

import type { AppThemeType } from "@/core/types";
import { Button } from "@/core/ui/Button/Button";
import type { CustomerType } from "@/modules/customers/public";
import { useOrdersList } from "../../../viewModel/useOrdersList";

import { useStyles } from "./OrdersListScreen.styles";
```

```ts
// ❌ смешаны блоки, стили не последними, нет пустых строк между группами
import { useStyles } from "./OrdersListScreen.styles";
import { useMemo } from "react";
import type { AppThemeType } from "@/core/types";
import { create } from "zustand";
```

## Экспорты

- Экспорт наружу модуля — только через `public/index.ts`, именованные
  экспорты, без `default` (см. также `naming-conventions.md`).
- Внутри проекта в принципе не использовать `export default` — только
  именованные экспорты (`export const`, `export type`), в любых файлах,
  не только в компонентах/экранах.

  ```ts
  // ✅
  export const formatDate = (date: Date): string => { ... };
  export type UserType = { id: string };

  // ❌
  export default function formatDate(date) { ... }
  ```

- Единственное исключение — файлы конфигурации в корне проекта
  (`vite.config.ts`, `eslint.config.ts` и подобные): инструменты
  требуют от них `export default`. На файлы внутри `src/` исключение не
  распространяется, включая `page.tsx` и `layout.tsx` в `app/`.
