import { useContext } from "react";

import { ThemeContext } from "@/core/providers/themeContext";
import type { AppThemeType } from "@/core/types";

export const useAppTheme = (): AppThemeType => useContext(ThemeContext);
