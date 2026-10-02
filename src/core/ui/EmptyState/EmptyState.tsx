import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { useStyles } from "./EmptyState.styles";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  const styles = useStyles();

  return (
    <div className={css(styles.root)}>
      <h2 className={css(styles.title)}>{title}</h2>
      <p className={css(styles.description)}>{description}</p>
      {action ? <div className={css(styles.action)}>{action}</div> : null}
    </div>
  );
};
