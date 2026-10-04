import { type ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { useSessionStore } from "@/core/stores/sessionStore";
import {
  getMillisecondsUntilTokenExpires,
  isTokenExpired,
} from "@/core/utils/jwt";

type PrivateRouteProps = {
  children: ReactNode;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const accessToken = useSessionStore((state) => state.accessToken);
  const logout = useSessionStore((state) => state.logout);
  const { pathname } = useLocation();

  // Re-runs on every navigation between protected pages, and the timer
  // ends the session at the exact moment the token expires even if the
  // user stays on one page.
  useEffect(() => {
    if (accessToken === null) {
      return;
    }

    if (isTokenExpired(accessToken)) {
      logout();
      return;
    }

    const logoutTimerId = window.setTimeout(
      logout,
      getMillisecondsUntilTokenExpires(accessToken),
    );

    return () => window.clearTimeout(logoutTimerId);
  }, [accessToken, logout, pathname]);

  if (accessToken === null) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return children;
};
