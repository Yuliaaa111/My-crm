import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { StyleConfigType } from "@/core/types";

export const styles = (): StyleConfigType => ({
  sections: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
});

export const useStyles = stylesConfiguratorHook(styles);
