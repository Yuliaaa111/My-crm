import { Moon, Sun } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { LIGHT_THEME_MODE } from "@/core/constants/theme";
import { useThemeStore } from "@/core/stores/themeStore";
import { IconButton } from "@/core/ui/IconButton/IconButton";

const ENABLE_DARK_THEME_LABEL = "Включить тёмную тему";
const ENABLE_LIGHT_THEME_LABEL = "Включить светлую тему";

export const ThemeToggle = () => {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const isLightMode = mode === LIGHT_THEME_MODE;

  return (
    <IconButton
      label={isLightMode ? ENABLE_DARK_THEME_LABEL : ENABLE_LIGHT_THEME_LABEL}
      onClick={toggleMode}
    >
      {isLightMode ? <Moon size={ICON_SIZE} /> : <Sun size={ICON_SIZE} />}
    </IconButton>
  );
};
