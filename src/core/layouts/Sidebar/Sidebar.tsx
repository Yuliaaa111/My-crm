import { css } from "@emotion/css";
import { NavLink } from "react-router-dom";

import { APP_NAME } from "@/core/constants/app";
import { ICON_SIZE } from "@/core/constants/layout";
import { NAVIGATION_ITEMS } from "@/core/constants/navigation";
import { ROUTES } from "@/core/constants/routes";

import { useStyles } from "./Sidebar.styles";

const NAVIGATION_LABEL = "Основная навигация";

export const Sidebar = () => {
  const styles = useStyles();

  return (
    <aside className={css(styles.root)}>
      <div className={css(styles.brand)}>{APP_NAME}</div>
      <nav className={css(styles.navigation)} aria-label={NAVIGATION_LABEL}>
        {NAVIGATION_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === ROUTES.dashboard}
            title={label}
            className={({ isActive }) =>
              css(styles.link, isActive && styles.activeLink)
            }
          >
            <Icon size={ICON_SIZE} />
            <span className={css(styles.linkLabel)}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
