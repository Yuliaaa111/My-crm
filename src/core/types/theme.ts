export type ThemeModeType = "light" | "dark";

export type AppColorsType = {
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primaryHover: string;
  primaryContrast: string;
  primarySoft: string;
  success: string;
  warning: string;
  danger: string;
  chartSeries: string;
};

export type AppFontsType = {
  sizes: {
    small: number;
    regular: number;
    medium: number;
    large: number;
    title: number;
  };
  weights: {
    regular: number;
    medium: number;
    bold: number;
  };
};

export type AppThemeType = {
  mode: ThemeModeType;
  colors: AppColorsType;
  fonts: AppFontsType;
};
