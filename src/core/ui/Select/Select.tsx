import { css } from "@emotion/css";
import type { ComponentProps } from "react";

import type { SelectOptionType } from "@/core/types";

import { useStyles } from "./Select.styles";

type SelectProps = Omit<ComponentProps<"select">, "className" | "children"> & {
  options: SelectOptionType[];
  hasError?: boolean;
};

export const Select = ({
  options,
  hasError = false,
  ...selectProps
}: SelectProps) => {
  const styles = useStyles(hasError);

  return (
    <select
      className={css(styles.root)}
      aria-invalid={hasError}
      {...selectProps}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
