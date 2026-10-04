import { BORDER_RADIUS, CONTROL_HEIGHT } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: CONTROL_HEIGHT,
    height: CONTROL_HEIGHT,
    padding: 0,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textSecondary,
    cursor: "pointer",
    transition: "background-color 0.15s ease, color 0.15s ease",
    "&:hover:not(:disabled)": {
      backgroundColor: theme.colors.surfaceHover,
      color: theme.colors.textPrimary,
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
});

export const useStyles = stylesConfiguratorHook(styles);
