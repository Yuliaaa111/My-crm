import { Badge } from "@/core/ui/Badge/Badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
} from "../../../model/constants";
import type { OrderStatusType } from "../../../model/types";

type OrderStatusBadgeProps = {
  status: OrderStatusType;
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <Badge
    label={ORDER_STATUS_LABELS[status]}
    tone={ORDER_STATUS_TONES[status]}
  />
);
