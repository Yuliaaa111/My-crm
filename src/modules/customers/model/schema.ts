import { z } from "zod";

import { isCountryCode } from "@/core/utils/countries";
import {
  CUSTOMER_STATUSES,
  CUSTOMER_VALIDATION_MESSAGES,
  PHONE_PATTERN,
} from "./constants";
import type { CustomerRequest, CustomerType } from "./types";

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
    countryCode: z
      .string()
      .refine(isCountryCode, CUSTOMER_VALIDATION_MESSAGES.countryCode),
    status: z.enum(CUSTOMER_STATUSES),
  });

// Validates rows restored from localStorage, not user input: the fields
// only need the right types, form rules (trimming, phone format) do not
// apply to data that was already saved once.
export const customerRecordSchema: z.ZodType<CustomerType> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.string(),
  city: z.string(),
  countryCode: z.string().refine(isCountryCode),
  status: z.enum(CUSTOMER_STATUSES),
  createdAt: z.iso.datetime(),
});
