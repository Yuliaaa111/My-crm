import js from "@eslint/js";
import type { Rule } from "eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const PLAIN_ASSERTION_SELECTOR =
  "TSAsExpression:not([typeAnnotation.typeName.name='const'])";

// Project rule: a plain `as` is allowed only when the type is known for
// sure and TypeScript cannot infer it, and the reason must be written
// next to it. ESLint has no built-in rule for that.
const commentedTypeAssertionRule: Rule.RuleModule = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      missingComment:
        "Explain in a comment on this or the previous line why this `as` is safe, or use zod / a type guard instead.",
    },
  },
  create: (context) => {
    const { sourceCode } = context;

    const reportUncommentedAssertion = (node: Rule.Node): void => {
      const assertionLine = node.loc?.start.line;
      const hasExplanation =
        assertionLine !== undefined &&
        sourceCode.getAllComments().some((comment) => {
          const commentEndLine = comment.loc?.end.line;
          const previousToken = sourceCode.getTokenBefore(comment);
          const isOnOwnLine =
            previousToken?.loc.end.line !== comment.loc?.start.line;

          return (
            commentEndLine === assertionLine ||
            (commentEndLine === assertionLine - 1 && isOnOwnLine)
          );
        });

      if (!hasExplanation) {
        context.report({ node, messageId: "missingComment" });
      }
    };

    return { [PLAIN_ASSERTION_SELECTOR]: reportUncommentedAssertion };
  },
};

const RESTRICTED_SYNTAX = [
  {
    selector: "TSAsExpression[expression.type='TSAsExpression']",
    message: "Double assertions like `as unknown as X` are not allowed.",
  },
  {
    selector: "TSTypeAssertion",
    message: "Use `as` with an explaining comment instead of `<Type>value`.",
  },
  {
    selector: "TSAnyKeyword",
    message: "Use a concrete type or `unknown` with a check.",
  },
  {
    selector: "TSInterfaceDeclaration",
    message: "Use `type` instead of `interface`.",
  },
  {
    selector: "TSEnumDeclaration",
    message: "Use a union type instead of `enum`.",
  },
  {
    selector: "TSSatisfiesExpression",
    message: "Use an explicit type annotation instead of `satisfies`.",
  },
];

const DEFAULT_EXPORT_RESTRICTION = {
  selector: "ExportDefaultDeclaration",
  message: "Use named exports only.",
};

export default defineConfig(
  globalIgnores([
    "dist/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    ".vite/**",
    ".claude/**",
  ]),
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
    },
    plugins: {
      "import-x": importX,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      prettier: prettierPlugin,
      local: {
        rules: { "commented-type-assertion": commentedTypeAssertionRule },
      },
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({ project: "./tsconfig.app.json" }),
      ],
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": "off",
      "no-restricted-syntax": ["error", ...RESTRICTED_SYNTAX],
      "local/commented-type-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000(?:node:|@?\\w)", "^node:", "^@?\\w"],
            ["^\\u0000(?:@/|\\.)", "^@/", "^\\.", "^"],
            [
              "^\\u0000.+(?:\\.styles|\\.(?:css|scss|sass|less))$",
              "^.+(?:\\.styles|\\.(?:css|scss|sass|less))$",
            ],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import-x/first": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-duplicates": "error",
      "prettier/prettier": "error",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...RESTRICTED_SYNTAX,
        DEFAULT_EXPORT_RESTRICTION,
      ],
    },
  },
  prettierConfig,
);
