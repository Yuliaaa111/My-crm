import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { StyleConfigType } from "@/core/types";

export const styles = (): StyleConfigType => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
    "& > *": {
      flex: "1 1 220px",
    },
    "& > *:first-of-type": {
      flex: "2 1 280px",
    },
  },
});

export const useStyles = stylesConfiguratorHook(styles);
