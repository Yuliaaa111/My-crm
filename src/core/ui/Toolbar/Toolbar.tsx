import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { useStyles } from "./Toolbar.styles";

type ToolbarProps = {
  children: ReactNode;
};

export const Toolbar = ({ children }: ToolbarProps) => {
  const styles = useStyles();

  return <div className={css(styles.root)}>{children}</div>;
};
