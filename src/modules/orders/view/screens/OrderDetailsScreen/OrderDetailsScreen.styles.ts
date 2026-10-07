import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)",
    alignItems: "start",
    gap: 16,
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    minWidth: 0,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
  },
  customerName: {
    marginBottom: 12,
    fontWeight: theme.fonts.weights.medium,
  },
  comment: {
    color: theme.colors.textSecondary,
    whiteSpace: "pre-line",
  },
  statusActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  finalStatus: {
    color: theme.colors.textSecondary,
  },
  statusError: {
    marginTop: 12,
    color: theme.colors.danger,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
