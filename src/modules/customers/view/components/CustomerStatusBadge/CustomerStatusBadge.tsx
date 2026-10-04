import { Badge } from "@/core/ui/Badge/Badge";
import {
  CUSTOMER_STATUS_LABELS,
  CUSTOMER_STATUS_TONES,
} from "../../../model/constants";
import type { CustomerStatusType } from "../../../model/types";

type CustomerStatusBadgeProps = {
  status: CustomerStatusType;
};

export const CustomerStatusBadge = ({ status }: CustomerStatusBadgeProps) => (
  <Badge
    label={CUSTOMER_STATUS_LABELS[status]}
    tone={CUSTOMER_STATUS_TONES[status]}
  />
);
