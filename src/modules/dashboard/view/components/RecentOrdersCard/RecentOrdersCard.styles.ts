import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
  },
  number: {
    fontWeight: theme.fonts.weights.medium,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
