import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { useStyles } from "./DescriptionList.styles";

export type DescriptionItemType = {
  label: string;
  value: ReactNode;
};

type DescriptionListProps = {
  items: DescriptionItemType[];
};

export const DescriptionList = ({ items }: DescriptionListProps) => {
  const styles = useStyles();

  return (
    <dl className={css(styles.root)}>
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt className={css(styles.term)}>{label}</dt>
          <dd className={css(styles.details)}>{value}</dd>
        </div>
      ))}
    </dl>
  );
};
