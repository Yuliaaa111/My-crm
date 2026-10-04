import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  message: {
    color: theme.colors.textSecondary,
  },
  error: {
    marginTop: 12,
    color: theme.colors.danger,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
