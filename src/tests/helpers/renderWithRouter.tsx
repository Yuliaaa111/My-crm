import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

type TestRouteType = {
  path: string;
  element: ReactElement;
};

// A data router like the real app uses, with stub pages for the places a
// screen may navigate to, so a test can assert where the user ended up.
export const renderWithRouter = (
  routes: TestRouteType[],
  initialPath: string,
) => {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });

  return { router, ...render(<RouterProvider router={router} />) };
};
