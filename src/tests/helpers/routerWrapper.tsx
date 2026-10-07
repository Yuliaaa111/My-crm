import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

// Hooks from viewModel call useNavigate/useParams, so renderHook needs a
// router around them.
export const RouterWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);
