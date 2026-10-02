import { useMemo } from "react";

import { useAppTheme } from "@/core/hooks/useAppTheme";
import type {
  AppThemeType,
  StyleArgumentType,
  StyleConfigType,
} from "@/core/types";

export const stylesConfiguratorHook =
  <StyleArguments extends StyleArgumentType[]>(
    styles: (theme: AppThemeType, ...args: StyleArguments) => StyleConfigType,
  ) =>
  (...args: StyleArguments): StyleConfigType => {
    const theme = useAppTheme();

    // The arguments are primitives and their count is fixed for a given
    // styles function, so spreading them into the dependency list is
    // safe; the linter just cannot verify a spread statically.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => styles(theme, ...args), [theme, ...args]);
  };
