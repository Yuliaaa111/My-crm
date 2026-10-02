import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/core/ui/ThemeToggle/ThemeToggle";

import { useStyles } from "./AuthLayout.styles";

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const styles = useStyles();

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.toolbar)}>
        <ThemeToggle />
      </div>
      <main className={css(styles.content)}>
        <div className={css(styles.panel)}>{children}</div>
      </main>
    </div>
  );
};
