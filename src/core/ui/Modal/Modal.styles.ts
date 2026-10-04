import { BORDER_RADIUS } from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

export const styles = (theme: AppThemeType): StyleConfigType => ({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(9, 12, 18, 0.55)",
  },
  dialog: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 560,
    maxHeight: "100%",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 24px",
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  title: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: theme.fonts.weights.bold,
  },
  body: {
    padding: 24,
    overflowY: "auto",
  },
});

export const useStyles = stylesConfiguratorHook(styles);
