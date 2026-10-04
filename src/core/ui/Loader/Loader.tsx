import { css } from "@emotion/css";

import { useStyles } from "./Loader.styles";

type LoaderProps = {
  label?: string;
};

export const Loader = ({ label = "Загрузка…" }: LoaderProps) => {
  const styles = useStyles();

  return (
    <div className={css(styles.root)} role="status">
      <span className={css(styles.spinner)} aria-hidden="true" />
      {label}
    </div>
  );
};
