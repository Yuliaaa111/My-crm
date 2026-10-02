import { Outlet } from "react-router-dom";

import { AppLayout } from "@/core/layouts/AppLayout/AppLayout";

export const Layout = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);
