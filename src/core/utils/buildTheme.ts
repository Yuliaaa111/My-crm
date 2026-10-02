import { COLORS_BY_MODE } from "@/core/constants/colors";
import { FONTS } from "@/core/constants/fonts";
import type { AppThemeType, ThemeModeType } from "@/core/types";

export const buildTheme = (mode: ThemeModeType): AppThemeType => ({
  mode,
  colors: COLORS_BY_MODE[mode],
  fonts: FONTS,
});
