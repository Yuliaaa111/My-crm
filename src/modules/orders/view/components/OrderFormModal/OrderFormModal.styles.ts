import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
  },
  items: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  itemRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 110px 40px",
    alignItems: "start",
    gap: 12,
    "& > button": {
      marginTop: 25,
    },
  },
  itemsError: {
    color: theme.colors.danger,
    fontSize: theme.fonts.sizes.small,
  },
  addItem: {
    alignSelf: "flex-start",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTop: `1px solid ${theme.colors.border}`,
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
  },
  submitError: {
    color: theme.colors.danger,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
