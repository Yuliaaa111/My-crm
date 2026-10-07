import { css } from "@emotion/css";

import type { StatTileType } from "../../../model/types";

import { useStyles } from "./StatTile.styles";

type StatTileProps = Omit<StatTileType, "key">;

export const StatTile = ({ label, value, hint }: StatTileProps) => {
  const styles = useStyles();

  return (
    <section className={css(styles.root)} aria-label={label}>
      <h2 className={css(styles.label)}>{label}</h2>
      <p className={css(styles.value)}>{value}</p>
      <p className={css(styles.hint)}>{hint}</p>
    </section>
  );
};
