import { Outlet } from "react-router-dom";

import { ThemeProviderManager } from "@/core/providers/ThemeProviderManager";

export const Layout = () => (
  <ThemeProviderManager>
    <Outlet />
  </ThemeProviderManager>
);
