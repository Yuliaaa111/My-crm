import { Badge } from "@/core/ui/Badge/Badge";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_TONES,
} from "../../../model/constants";
import type { ProductStatusType } from "../../../model/types";

type ProductStatusBadgeProps = {
  status: ProductStatusType;
};

export const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => (
  <Badge
    label={PRODUCT_STATUS_LABELS[status]}
    tone={PRODUCT_STATUS_TONES[status]}
  />
);
