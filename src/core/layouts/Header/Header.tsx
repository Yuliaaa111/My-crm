import { css } from "@emotion/css";

import { ThemeToggle } from "@/core/ui/ThemeToggle/ThemeToggle";

import { useStyles } from "./Header.styles";

export const Header = () => {
  const styles = useStyles();

  return (
    <header className={css(styles.root)}>
      <ThemeToggle />
    </header>
  );
};
