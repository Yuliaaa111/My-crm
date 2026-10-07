import type { ComponentType } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { buildRoutes } from "@/core/routes/buildRoutes";
import { Loader } from "@/core/ui/Loader/Loader";
import { NotFound } from "./not-found";

const pageLoaders = import.meta.glob<ComponentType>("./**/page.tsx", {
  import: "Page",
});

const layouts = import.meta.glob<ComponentType>("./**/layout.tsx", {
  eager: true,
  import: "Layout",
});

const router = createBrowserRouter(
  buildRoutes({ pageLoaders, layouts, NotFound, PageFallback: Loader }),
);

export const AppRouter = () => <RouterProvider router={router} />;
