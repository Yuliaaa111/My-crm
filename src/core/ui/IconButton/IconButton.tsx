import { css } from "@emotion/css";
import type { MouseEvent, ReactNode } from "react";

import { useStyles } from "./IconButton.styles";

type IconButtonProps = {
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  isDisabled?: boolean;
};

export const IconButton = ({
  label,
  onClick,
  children,
  isDisabled = false,
}: IconButtonProps) => {
  const styles = useStyles();

  return (
    <button
      type="button"
      className={css(styles.root)}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
};
