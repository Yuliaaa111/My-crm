import type { AppColorsType, ThemeModeType } from "@/core/types";

export const LIGHT_COLORS: AppColorsType = {
  background: "#f4f6fa",
  surface: "#ffffff",
  surfaceHover: "#eef1f6",
  border: "#dfe3ea",
  textPrimary: "#1b2330",
  textSecondary: "#5f6b7c",
  primary: "#2f5bea",
  primaryHover: "#2549c4",
  primaryContrast: "#ffffff",
  primarySoft: "#e6ecff",
  success: "#1f9d61",
  warning: "#c98a12",
  danger: "#d64545",
};

export const DARK_COLORS: AppColorsType = {
  background: "#0f131a",
  surface: "#181d27",
  surfaceHover: "#222937",
  border: "#2b3342",
  textPrimary: "#e8ecf3",
  textSecondary: "#9aa5b8",
  primary: "#6d8dff",
  primaryHover: "#8aa3ff",
  primaryContrast: "#0f131a",
  primarySoft: "#1f2a4a",
  success: "#4cc38a",
  warning: "#e3b341",
  danger: "#f07178",
};

export const COLORS_BY_MODE: Record<ThemeModeType, AppColorsType> = {
  light: LIGHT_COLORS,
  dark: DARK_COLORS,
};
