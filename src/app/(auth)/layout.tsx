import { Outlet } from "react-router-dom";

import { AuthLayout } from "@/core/layouts/AuthLayout/AuthLayout";
import { GuestRoute } from "@/core/routes/GuestRoute";

export const Layout = () => (
  <GuestRoute>
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  </GuestRoute>
);
