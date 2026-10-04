import { css } from "@emotion/css";
import type { ReactNode } from "react";

import type { ButtonVariantType } from "@/core/types";

import { useStyles } from "./Button.styles";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariantType;
  isDisabled?: boolean;
};

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  isDisabled = false,
}: ButtonProps) => {
  const styles = useStyles(variant);

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
