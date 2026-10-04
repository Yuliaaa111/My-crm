import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { useStyles } from "./PageHeader.styles";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
};

export const PageHeader = ({
  title,
  description,
  leading,
  actions,
}: PageHeaderProps) => {
  const styles = useStyles();

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.heading)}>
        {leading}
        <div className={css(styles.titles)}>
          <h1 className={css(styles.title)}>{title}</h1>
          {description ? (
            <div className={css(styles.description)}>{description}</div>
          ) : null}
        </div>
      </div>
      {actions ? <div className={css(styles.actions)}>{actions}</div> : null}
    </div>
  );
};
