import { css } from "@emotion/css";
import { LogOut } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { useSessionStore } from "@/core/stores/sessionStore";
import { IconButton } from "@/core/ui/IconButton/IconButton";
import { ThemeToggle } from "@/core/ui/ThemeToggle/ThemeToggle";

import { useStyles } from "./Header.styles";

const LOGOUT_LABEL = "Выйти";

export const Header = () => {
  const styles = useStyles();
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);

  return (
    <header className={css(styles.root)}>
      {user ? (
        <div className={css(styles.user)}>
          <span className={css(styles.userName)}>{user.name}</span>
          <span className={css(styles.userEmail)}>{user.email}</span>
        </div>
      ) : null}
      <ThemeToggle />
      <IconButton label={LOGOUT_LABEL} onClick={logout}>
        <LogOut size={ICON_SIZE} />
      </IconButton>
    </header>
  );
};
