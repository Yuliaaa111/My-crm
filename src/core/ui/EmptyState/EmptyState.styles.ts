import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "48px 24px",
    textAlign: "center",
  },
  title: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },
  description: {
    maxWidth: 420,
    fontSize: theme.fonts.sizes.regular,
    color: theme.colors.textSecondary,
  },
  action: {
    marginTop: 16,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
