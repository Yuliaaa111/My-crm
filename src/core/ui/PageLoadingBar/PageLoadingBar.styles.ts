import { keyframes } from "@emotion/css";

import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

const slide = keyframes({
  from: { transform: "translateX(-100%)" },
  to: { transform: "translateX(250%)" },
});

export const styles = (theme: AppThemeType): StyleConfigType => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    height: 3,
    overflow: "hidden",
    pointerEvents: "none",
  },
  bar: {
    width: "40%",
    height: "100%",
    backgroundColor: theme.colors.primary,
    animation: `${slide} 1s ease-in-out infinite`,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
