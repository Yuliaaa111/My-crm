import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  sku: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  total: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 24,
    marginTop: 16,
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
