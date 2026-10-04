import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 24,
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.regular,
    color: theme.colors.textSecondary,
  },
  demoHint: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: `1px solid ${theme.colors.border}`,
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
