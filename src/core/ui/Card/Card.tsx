import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { useStyles } from "./Card.styles";

type CardProps = {
  children: ReactNode;
};

export const Card = ({ children }: CardProps) => {
  const styles = useStyles();

  return <div className={css(styles.root)}>{children}</div>;
};
