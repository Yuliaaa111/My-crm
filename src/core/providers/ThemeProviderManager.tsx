import { type ReactNode, useEffect, useMemo } from "react";

import { useThemeStore } from "@/core/stores/themeStore";
import { buildTheme } from "@/core/utils/buildTheme";
import { ThemeContext } from "./themeContext";

type ThemeProviderManagerProps = {
  children: ReactNode;
};

export const ThemeProviderManager = ({
  children,
}: ThemeProviderManagerProps) => {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => buildTheme(mode), [mode]);

  // The page background outside of #root (overscroll, scrollbars) is not
  // reachable from component styles, so it is synced with the theme here.
  useEffect(() => {
    document.documentElement.style.colorScheme = theme.mode;
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.textPrimary;
  }, [theme]);

  return <ThemeContext value={theme}>{children}</ThemeContext>;
};
