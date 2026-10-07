import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  headerBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  sections: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
  },
  description: {
    color: theme.colors.textSecondary,
    whiteSpace: "pre-line",
  },
});

export const useStyles = stylesConfiguratorHook(styles);
