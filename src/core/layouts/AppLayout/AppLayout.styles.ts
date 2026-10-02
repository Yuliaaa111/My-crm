import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    height: "100%",
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minWidth: 0,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    overflowY: "auto",
  },
});

export const useStyles = stylesConfiguratorHook(styles);
