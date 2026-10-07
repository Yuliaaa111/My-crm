import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  name: {
    fontWeight: theme.fonts.weights.medium,
  },
  secondaryLine: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  actions: {
    display: "inline-flex",
    gap: 8,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
