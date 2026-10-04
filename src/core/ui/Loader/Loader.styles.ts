import { keyframes } from "@emotion/css";

import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

const spin = keyframes({ to: { transform: "rotate(360deg)" } });

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "48px 16px",
    color: theme.colors.textSecondary,
  },
  spinner: {
    width: 20,
    height: 20,
    border: `2px solid ${theme.colors.border}`,
    borderTopColor: theme.colors.primary,
    borderRadius: "50%",
    animation: `${spin} 0.8s linear infinite`,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
