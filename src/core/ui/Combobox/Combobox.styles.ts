import {
  BORDER_RADIUS,
  CONTROL_HEIGHT,
  ICON_SIZE,
} from "@/core/constants/layout";
import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { AppThemeType, StyleConfigType } from "@/core/types";

const LIST_MAX_HEIGHT = 240;
const TOGGLE_WIDTH = 36;

export const styles = (
  theme: AppThemeType,
  hasError: boolean,
): StyleConfigType => ({
  root: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    height: CONTROL_HEIGHT,
    padding: `0 ${TOGGLE_WIDTH}px 0 12px`,
    border: `1px solid ${hasError ? theme.colors.danger : theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.regular,
    outline: "none",
    textOverflow: "ellipsis",
    "&::placeholder": {
      color: theme.colors.textSecondary,
    },
    "&:focus": {
      borderColor: hasError ? theme.colors.danger : theme.colors.primary,
    },
  },
  toggle: {
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: TOGGLE_WIDTH,
    height: CONTROL_HEIGHT,
    padding: 0,
    border: "none",
    background: "none",
    color: theme.colors.textSecondary,
    cursor: "pointer",
  },
  popup: {
    position: "absolute",
    top: CONTROL_HEIGHT + 4,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: BORDER_RADIUS,
    backgroundColor: theme.colors.surface,
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.18)",
  },
  list: {
    maxHeight: LIST_MAX_HEIGHT,
    margin: 0,
    padding: 4,
    overflowY: "auto",
    listStyle: "none",
  },
  option: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "8px 10px",
    borderRadius: BORDER_RADIUS - 4,
    color: theme.colors.textPrimary,
    cursor: "pointer",
  },
  activeOption: {
    backgroundColor: theme.colors.surfaceHover,
  },
  selectedOption: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.medium,
  },
  optionDescription: {
    fontSize: theme.fonts.sizes.small,
    fontWeight: theme.fonts.weights.regular,
    color: theme.colors.textSecondary,
  },
  noResults: {
    padding: "12px 14px",
    color: theme.colors.textSecondary,
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
  toggleIcon: {
    width: ICON_SIZE - 4,
    height: ICON_SIZE - 4,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
