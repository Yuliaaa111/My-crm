import {
  BORDER_RADIUS,
  COMPACT_LAYOUT_MEDIA_QUERY,
  HEADER_HEIGHT,
  SIDEBAR_COMPACT_WIDTH,
  SIDEBAR_WIDTH,
} from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    width: SIDEBAR_WIDTH,
    borderRight: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    [COMPACT_LAYOUT_MEDIA_QUERY]: {
      width: SIDEBAR_COMPACT_WIDTH,
    },
  },
  brand: {
    display: "flex",
    alignItems: "center",
    height: HEADER_HEIGHT,
    padding: "0 24px",
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: theme.fonts.sizes.large,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    [COMPACT_LAYOUT_MEDIA_QUERY]: {
      justifyContent: "center",
      padding: 0,
      fontSize: theme.fonts.sizes.small,
    },
  },
  navigation: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: 12,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: BORDER_RADIUS,
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.sizes.regular,
    fontWeight: theme.fonts.weights.medium,
    transition: "background-color 0.15s ease, color 0.15s ease",
    "&:hover": {
      backgroundColor: theme.colors.surfaceHover,
      color: theme.colors.textPrimary,
    },
    [COMPACT_LAYOUT_MEDIA_QUERY]: {
      justifyContent: "center",
    },
  },
  activeLink: {
    backgroundColor: theme.colors.primarySoft,
    color: theme.colors.primary,
    "&:hover": {
      backgroundColor: theme.colors.primarySoft,
      color: theme.colors.primary,
    },
  },
  linkLabel: {
    [COMPACT_LAYOUT_MEDIA_QUERY]: {
      display: "none",
    },
  },
});

export const useStyles = stylesConfiguratorHook(styles);
