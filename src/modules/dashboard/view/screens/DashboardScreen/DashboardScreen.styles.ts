import { stylesConfiguratorHook } from "@/core/styles/stylesConfiguratorHook";
import type { StyleConfigType } from "@/core/types";

export const styles = (): StyleConfigType => ({
  sections: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  tiles: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
    gap: 16,
  },
  charts: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))",
    gap: 16,
  },
  wideChart: {
    gridColumn: "1 / -1",
  },
});

export const useStyles = stylesConfiguratorHook(styles);
