import { Outlet } from "react-router-dom";

import { ThemeProviderManager } from "@/core/providers/ThemeProviderManager";
import { PageLoadingBar } from "@/core/ui/PageLoadingBar/PageLoadingBar";

export const Layout = () => (
  <ThemeProviderManager>
    <PageLoadingBar />
    <Outlet />
  </ThemeProviderManager>
);
