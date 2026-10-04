import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type {
  AppThemeType,
  BadgeToneType,
  StyleConfigType,
} from "@/core/types";

export const styles = (
  theme: AppThemeType,
  tone: BadgeToneType,
): StyleConfigType => {
  const toneColors: Record<BadgeToneType, string> = {
    neutral: theme.colors.textSecondary,
    info: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
  };
  const toneColor = toneColors[tone];

  return {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "2px 10px",
      borderRadius: 999,
      border: `1px solid ${toneColor}`,
      color: toneColor,
      fontSize: theme.fonts.sizes.small,
      fontWeight: theme.fonts.weights.medium,
      whiteSpace: "nowrap",
    },
  };
};

export const useStyles = stylesConfiguratorHook(styles);
