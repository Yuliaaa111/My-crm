import { createContext } from "react";

import { LIGHT_THEME_MODE } from "@/core/constants/theme";
import type { AppThemeType } from "@/core/types";
import { buildTheme } from "@/core/utils/buildTheme";

export const ThemeContext = createContext<AppThemeType>(
  buildTheme(LIGHT_THEME_MODE),
);
