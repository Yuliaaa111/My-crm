import type { OrderStatusType } from "@/modules/orders/public";

export type StatTileType = {
  key: string;
  label: string;
  value: string;
  hint: string;
};

export type ChartDatumType = {
  key: string;
  label: string;
  value: number;
  valueLabel: string;
};

export type RecentOrderType = {
  id: string;
  number: string;
  customerName: string;
  createdAtLabel: string;
  totalLabel: string;
  status: OrderStatusType;
};
