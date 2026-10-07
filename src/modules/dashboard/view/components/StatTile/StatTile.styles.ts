import { BORDER_RADIUS } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 20,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
  },
  label: {
    fontSize: theme.fonts.sizes.small,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: 28,
    fontWeight: theme.fonts.weights.bold,
    lineHeight: 1.2,
    color: theme.colors.textPrimary,
  },
  hint: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
