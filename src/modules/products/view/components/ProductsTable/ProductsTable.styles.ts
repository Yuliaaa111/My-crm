import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  name: {
    fontWeight: theme.fonts.weights.medium,
  },
  sku: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  stock: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  actions: {
    display: "inline-flex",
    gap: 8,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
