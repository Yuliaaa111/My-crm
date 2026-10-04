import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  submitError: {
    fontSize: theme.fonts.sizes.regular,
    color: theme.colors.danger,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
