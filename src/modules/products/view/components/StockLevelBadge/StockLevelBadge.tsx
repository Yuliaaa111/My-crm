import { Badge } from "@/core/ui/Badge/Badge";
import {
  PRODUCT_STOCK_LEVEL_LABELS,
  PRODUCT_STOCK_LEVEL_TONES,
} from "../../../model/constants";
import type { ProductStockLevelType } from "../../../model/types";

type StockLevelBadgeProps = {
  stockLevel: ProductStockLevelType;
};

export const StockLevelBadge = ({ stockLevel }: StockLevelBadgeProps) => (
  <Badge
    label={PRODUCT_STOCK_LEVEL_LABELS[stockLevel]}
    tone={PRODUCT_STOCK_LEVEL_TONES[stockLevel]}
  />
);
