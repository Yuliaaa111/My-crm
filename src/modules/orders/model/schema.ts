import { z } from "zod";

import { MAX_COMMENT_LENGTH, ORDER_VALIDATION_MESSAGES } from "./constants";
import type { OrderFormValuesType } from "./types";

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
