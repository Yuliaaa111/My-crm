import { BORDER_RADIUS } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (
  theme: AppThemeType,
  hasClickableRows: boolean,
): StyleConfigType => ({
  wrapper: {
    width: "100%",
    overflowX: "auto",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: theme.fonts.sizes.regular,
  },
  headerCell: {
    padding: "12px 16px",
    borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.sizes.small,
    fontWeight: theme.fonts.weights.medium,
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  row: {
    cursor: hasClickableRows ? "pointer" : "default",
    transition: "background-color 0.15s ease",
    "&:not(:last-of-type) td": {
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    "&:hover": {
      backgroundColor: hasClickableRows
        ? theme.colors.surfaceHover
        : "transparent",
    },
    "&:focus-visible": {
      outline: `2px solid ${theme.colors.primary}`,
      outlineOffset: -2,
    },
  },
  cell: {
    padding: "12px 16px",
    color: theme.colors.textPrimary,
    verticalAlign: "middle",
  },
  rightAligned: {
    textAlign: "right",
  },
  emptyMessage: {
    padding: "32px 16px",
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

export const useStyles = stylesConfiguratorHook(styles);
