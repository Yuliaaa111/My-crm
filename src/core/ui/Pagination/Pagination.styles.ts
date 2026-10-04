import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  status: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
