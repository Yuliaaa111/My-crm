import { Outlet } from "react-router-dom";

import { AppLayout } from "@/core/layouts/AppLayout/AppLayout";
import { PrivateRoute } from "@/core/routes/PrivateRoute";

export const Layout = () => (
  <PrivateRoute>
    <AppLayout>
      <Outlet />
    </AppLayout>
  </PrivateRoute>
);
