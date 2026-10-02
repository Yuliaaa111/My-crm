import { BORDER_RADIUS } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    padding: 24,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
