import { css } from "@emotion/css";
import type { ReactNode } from "react";

import { Header } from "@/core/layouts/Header/Header";
import { Sidebar } from "@/core/layouts/Sidebar/Sidebar";

import { useStyles } from "./AppLayout.styles";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const styles = useStyles();

  return (
    <div className={css(styles.root)}>
      <Sidebar />
      <div className={css(styles.main)}>
        <Header />
        <main className={css(styles.content)}>{children}</main>
      </div>
    </div>
  );
};
