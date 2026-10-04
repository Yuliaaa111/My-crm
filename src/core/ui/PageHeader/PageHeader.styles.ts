import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  heading: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  titles: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    overflowWrap: "anywhere",
  },
  description: {
    fontSize: theme.fonts.sizes.regular,
    color: theme.colors.textSecondary,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
