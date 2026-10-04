import { css } from "@emotion/css";
import type { ComponentProps } from "react";

import { useStyles } from "./Input.styles";

type InputProps = Omit<ComponentProps<"input">, "className"> & {
  hasError?: boolean;
};

export const Input = ({ hasError = false, ...inputProps }: InputProps) => {
  const styles = useStyles(hasError);

  return (
    <input
      className={css(styles.root)}
      aria-invalid={hasError}
      {...inputProps}
    />
  );
};
