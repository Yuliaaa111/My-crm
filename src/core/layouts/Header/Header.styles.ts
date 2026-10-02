import { HEADER_HEIGHT } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    flexShrink: 0,
    height: HEADER_HEIGHT,
    padding: "0 24px",
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
