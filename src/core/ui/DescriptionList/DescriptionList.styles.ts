import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px 24px",
    margin: 0,
  },
  term: {
    marginBottom: 4,
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  details: {
    margin: 0,
    color: theme.colors.textPrimary,
    overflowWrap: "anywhere",
  },
});

export const useStyles = stylesConfiguratorHook(styles);
