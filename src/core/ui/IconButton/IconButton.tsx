import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { useStyles } from "./IconButton.styles";

type IconButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

export const IconButton = ({ label, onClick, children }: IconButtonProps) => {
  const styles = useStyles();

  return (
    <button
      type="button"
      className={css(styles.root)}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
};
