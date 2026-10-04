import { BORDER_RADIUS, CONTROL_HEIGHT } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (
  theme: AppThemeType,
  hasError: boolean,
): StyleConfigType => ({
  root: {
    width: "100%",
    height: CONTROL_HEIGHT,
    padding: "0 12px",
    border: `1px solid ${hasError ? theme.colors.danger : theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.regular,
    outline: "none",
    cursor: "pointer",
    "&:focus": {
      borderColor: hasError ? theme.colors.danger : theme.colors.primary,
    },
  },
});

export const useStyles = stylesConfiguratorHook(styles);
