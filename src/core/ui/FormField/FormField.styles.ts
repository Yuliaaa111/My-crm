import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: theme.fonts.sizes.small,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.textSecondary,
  },
  error: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.danger,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
