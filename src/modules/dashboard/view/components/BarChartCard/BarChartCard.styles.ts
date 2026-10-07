import {
  BORDER_RADIUS,
  COMPACT_LAYOUT_MEDIA_QUERY,
} from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
    padding: 20,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
    [COMPACT_LAYOUT_MEDIA_QUERY]: {
      padding: 16,
    },
  },
  title: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginBottom: 12,
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  empty: {
    padding: "32px 0",
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
