import { Outlet } from "react-router-dom";

import { AuthLayout } from "@/core/layouts/AuthLayout/AuthLayout";

export const Layout = () => (
  <AuthLayout>
    <Outlet />
  </AuthLayout>
);
