import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { useStyles } from "./FormField.styles";

type FormFieldProps = {
  label: string;
  fieldId: string;
  errorMessage?: string;
  children: ReactNode;
};

export const FormField = ({
  label,
  fieldId,
  errorMessage,
  children,
}: FormFieldProps) => {
  const styles = useStyles();

  return (
    <div className={css(styles.root)}>
      <label className={css(styles.label)} htmlFor={fieldId}>
        {label}
      </label>
      {children}
      {errorMessage ? (
        <span className={css(styles.error)} role="alert">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
};
