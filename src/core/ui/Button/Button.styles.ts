import { BORDER_RADIUS, CONTROL_HEIGHT } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (
  theme: AppThemeType,
  isPrimary: boolean,
): StyleConfigType => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: CONTROL_HEIGHT,
    padding: "0 16px",
    border: `1px solid ${isPrimary ? theme.colors.primary : theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: isPrimary ? theme.colors.primary : theme.colors.surface,
    color: isPrimary ? theme.colors.primaryContrast : theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.regular,
    fontWeight: theme.fonts.weights.medium,
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    "&:hover:not(:disabled)": {
      backgroundColor: isPrimary
        ? theme.colors.primaryHover
        : theme.colors.surfaceHover,
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
});

export const useStyles = stylesConfiguratorHook(styles);
