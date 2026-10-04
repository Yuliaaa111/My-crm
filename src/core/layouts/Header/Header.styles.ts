import {
  COMPACT_LAYOUT_MEDIA_QUERY,
  HEADER_HEIGHT,
} from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    flexShrink: 0,
    height: HEADER_HEIGHT,
    padding: "0 24px",
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
  },
  user: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: 4,
    lineHeight: 1.3,
    [COMPACT_LAYOUT_MEDIA_QUERY]: {
      display: "none",
    },
  },
  userName: {
    fontSize: theme.fonts.sizes.regular,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.textPrimary,
  },
  userEmail: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
