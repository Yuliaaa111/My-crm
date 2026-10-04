import { z } from "zod";

import { INVALID_EMAIL_MESSAGE, REQUIRED_PASSWORD_MESSAGE } from "./constants";
import type { AuthRequest } from "./types";

export const loginSchema: z.ZodType<AuthRequest, AuthRequest> = z.object({
  email: z.email(INVALID_EMAIL_MESSAGE),
  password: z.string().min(1, REQUIRED_PASSWORD_MESSAGE),
});
