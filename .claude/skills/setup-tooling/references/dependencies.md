# Зависимости для `references/eslint.config.ts` и `references/vite.config.ts`

Без этих пакетов эталонный `eslint.config.ts` не заработает:

- `eslint`
- `@eslint/js`
- `typescript-eslint`
- `eslint-config-prettier`
- `eslint-plugin-import`
- `eslint-plugin-prettier`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `eslint-plugin-simple-import-sort`
- `eslint-plugin-unused-imports`
- `globals`
- `prettier`

Для `vite.config.ts`:

- `@vitejs/plugin-react`

Перед установкой — показать пользователю этот список и получить явное
подтверждение (см. `SKILL.md`, шаг 3).
