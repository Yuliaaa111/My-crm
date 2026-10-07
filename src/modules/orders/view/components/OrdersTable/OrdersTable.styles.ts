import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  number: {
    fontWeight: theme.fonts.weights.medium,
  },
  total: {
    fontWeight: theme.fonts.weights.medium,
    whiteSpace: "nowrap",
  },
});

export const useStyles = stylesConfiguratorHook(styles);
