import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { useStyles } from "./Button.styles";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  isDisabled?: boolean;
};

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  isDisabled = false,
}: ButtonProps) => {
  const styles = useStyles(variant === "primary");

  return (
    <button
      type={type}
      className={css(styles.root)}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};
