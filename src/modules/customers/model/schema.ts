import { z } from "zod";

import {
  CUSTOMER_STATUSES,
  CUSTOMER_VALIDATION_MESSAGES,
  PHONE_PATTERN,
} from "./constants";
import type { CustomerRequest } from "./types";

export const customerSchema: z.ZodType<CustomerRequest, CustomerRequest> =
  z.object({
    firstName: z.string().trim().min(1, CUSTOMER_VALIDATION_MESSAGES.firstName),
    lastName: z.string().trim().min(1, CUSTOMER_VALIDATION_MESSAGES.lastName),
    email: z.email(CUSTOMER_VALIDATION_MESSAGES.email),
    phone: z
      .string()
      .trim()
      .regex(PHONE_PATTERN, CUSTOMER_VALIDATION_MESSAGES.phone),
    company: z.string().trim(),
    city: z.string().trim().min(1, CUSTOMER_VALIDATION_MESSAGES.city),
    country: z.string().trim().min(1, CUSTOMER_VALIDATION_MESSAGES.country),
    status: z.enum(CUSTOMER_STATUSES),
  });
