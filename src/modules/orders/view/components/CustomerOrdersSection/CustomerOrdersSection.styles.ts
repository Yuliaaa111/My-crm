import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
  },
  summary: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  message: {
    color: theme.colors.textSecondary,
  },
  error: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    color: theme.colors.danger,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
