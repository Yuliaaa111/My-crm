import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    backgroundColor: theme.colors.background,
    color: theme.colors.textPrimary,
  },
  toolbar: {
    display: "flex",
    justifyContent: "flex-end",
    padding: 16,
  },
  content: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  panel: {
    width: "100%",
    maxWidth: 420,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
