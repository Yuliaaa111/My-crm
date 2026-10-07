import { z } from "zod";

import {
  MAX_DESCRIPTION_LENGTH,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_VALIDATION_MESSAGES,
  SKU_PATTERN,
} from "./constants";
import type { ProductRequest, ProductType } from "./types";

export const productSchema: z.ZodType<ProductRequest, ProductRequest> =
  z.object({
    name: z.string().trim().min(1, PRODUCT_VALIDATION_MESSAGES.name),
    sku: z
      .string()
      .trim()
      .toUpperCase()
      .regex(SKU_PATTERN, PRODUCT_VALIDATION_MESSAGES.sku),
    category: z.enum(PRODUCT_CATEGORIES),
    price: z
      .number(PRODUCT_VALIDATION_MESSAGES.price)
      .min(0, PRODUCT_VALIDATION_MESSAGES.priceMin),
    stock: z
      .int(PRODUCT_VALIDATION_MESSAGES.stock)
      .min(0, PRODUCT_VALIDATION_MESSAGES.stockMin),
    status: z.enum(PRODUCT_STATUSES),
    description: z
      .string()
      .trim()
      .max(MAX_DESCRIPTION_LENGTH, PRODUCT_VALIDATION_MESSAGES.description),
  });

// Validates rows restored from localStorage, not user input.
export const productRecordSchema: z.ZodType<ProductType> = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  category: z.enum(PRODUCT_CATEGORIES),
  price: z.number().min(0),
  stock: z.int().min(0),
  status: z.enum(PRODUCT_STATUSES),
  description: z.string(),
  createdAt: z.iso.datetime(),
});
