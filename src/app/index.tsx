import type { ComponentType } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { buildRoutes } from "@/core/routes/buildRoutes";
import { NotFound } from "./not-found";

const pages = import.meta.glob<ComponentType>("./**/page.tsx", {
  eager: true,
  import: "Page",
});

const layouts = import.meta.glob<ComponentType>("./**/layout.tsx", {
  eager: true,
  import: "Layout",
});

const router = createBrowserRouter(buildRoutes({ pages, layouts, NotFound }));

export const AppRouter = () => <RouterProvider router={router} />;
