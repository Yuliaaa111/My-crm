import { css } from "@emotion/css";
import type { ComponentProps } from "react";

import { useStyles } from "./Textarea.styles";

type TextareaProps = Omit<ComponentProps<"textarea">, "className"> & {
  hasError?: boolean;
};

export const Textarea = ({
  hasError = false,
  ...textareaProps
}: TextareaProps) => {
  const styles = useStyles(hasError);

  return (
    <textarea
      className={css(styles.root)}
      aria-invalid={hasError}
      {...textareaProps}
    />
  );
};
