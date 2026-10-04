import { css } from "@emotion/css";

import type { BadgeToneType } from "@/core/types";

import { useStyles } from "./Badge.styles";

type BadgeProps = {
  label: string;
  tone?: BadgeToneType;
};

export const Badge = ({ label, tone = "neutral" }: BadgeProps) => {
  const styles = useStyles(tone);

  return <span className={css(styles.root)}>{label}</span>;
};
