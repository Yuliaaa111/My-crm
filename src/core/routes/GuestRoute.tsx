import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { useSessionStore } from "@/core/stores/sessionStore";

type GuestRouteProps = {
  children: ReactNode;
};

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const accessToken = useSessionStore((state) => state.accessToken);

  if (accessToken !== null) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return children;
};
