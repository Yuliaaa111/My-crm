import { z } from "zod";

import {
  MAX_COMMENT_LENGTH,
  ORDER_STATUSES,
  ORDER_VALIDATION_MESSAGES,
} from "./constants";
import type { OrderFormValuesType, OrderType } from "./types";

const hasUniqueProducts = (items: { productId: string }[]): boolean =>
  new Set(items.map(({ productId }) => productId)).size === items.length;

export const orderFormSchema: z.ZodType<
  OrderFormValuesType,
  OrderFormValuesType
> = z.object({
  customerId: z.string().min(1, ORDER_VALIDATION_MESSAGES.customer),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, ORDER_VALIDATION_MESSAGES.product),
        quantity: z
          .int(ORDER_VALIDATION_MESSAGES.quantity)
          .min(1, ORDER_VALIDATION_MESSAGES.quantity),
      }),
    )
    .min(1, ORDER_VALIDATION_MESSAGES.noItems)
    .refine(hasUniqueProducts, ORDER_VALIDATION_MESSAGES.duplicateProducts),
  comment: z
    .string()
    .trim()
    .max(MAX_COMMENT_LENGTH, ORDER_VALIDATION_MESSAGES.comment),
});

const orderStatusSchema = z.enum(ORDER_STATUSES);

// Validates rows restored from localStorage, not user input.
export const orderRecordSchema: z.ZodType<OrderType> = z.object({
  id: z.string(),
  number: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  status: orderStatusSchema,
  createdAt: z.iso.datetime(),
  comment: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      sku: z.string(),
      unitPrice: z.number().min(0),
      quantity: z.int().min(1),
    }),
  ),
  statusHistory: z.array(
    z.object({ status: orderStatusSchema, changedAt: z.iso.datetime() }),
  ),
});
