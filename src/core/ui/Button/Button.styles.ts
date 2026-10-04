import { BORDER_RADIUS, CONTROL_HEIGHT } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type {
  AppThemeType,
  ButtonVariantType,
  StyleConfigType,
} from "@/core/types";

const getVariantColors = (theme: AppThemeType, variant: ButtonVariantType) => {
  const variantColors: Record<
    ButtonVariantType,
    { background: string; hover: string; text: string; border: string }
  > = {
    primary: {
      background: theme.colors.primary,
      hover: theme.colors.primaryHover,
      text: theme.colors.primaryContrast,
      border: theme.colors.primary,
    },
    secondary: {
      background: theme.colors.surface,
      hover: theme.colors.surfaceHover,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
    },
    danger: {
      background: theme.colors.danger,
      hover: theme.colors.danger,
      text: theme.colors.primaryContrast,
      border: theme.colors.danger,
    },
  };

  return variantColors[variant];
};

export const styles = (
  theme: AppThemeType,
  variant: ButtonVariantType,
): StyleConfigType => {
  const colors = getVariantColors(theme, variant);

  return {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: CONTROL_HEIGHT,
      padding: "0 16px",
      border: `1px solid ${colors.border}`,
      borderRadius: BORDER_RADIUS,
      backgroundColor: colors.background,
      color: colors.text,
      fontSize: theme.fonts.sizes.regular,
      fontWeight: theme.fonts.weights.medium,
      whiteSpace: "nowrap",
      cursor: "pointer",
      transition: "background-color 0.15s ease, filter 0.15s ease",
      "&:hover:not(:disabled)": {
        backgroundColor: colors.hover,
        filter: variant === "danger" ? "brightness(0.92)" : "none",
      },
      "&:disabled": {
        opacity: 0.6,
        cursor: "not-allowed",
      },
    },
  };
};

export const useStyles = stylesConfiguratorHook(styles);
