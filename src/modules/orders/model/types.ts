export type OrderStatusType =
  "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderStatusFilterType = OrderStatusType | "all";

export type OrderItemType = {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
};

export type OrderStatusChangeType = {
  status: OrderStatusType;
  changedAt: string;
};

export type OrderType = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  status: OrderStatusType;
  createdAt: string;
  comment: string;
  items: OrderItemType[];
  statusHistory: OrderStatusChangeType[];
};

export type OrderItemViewType = OrderItemType & {
  unitPriceLabel: string;
  lineTotalLabel: string;
};

export type OrderStatusChangeViewType = OrderStatusChangeType & {
  changedAtLabel: string;
};

export type OrderViewType = Omit<OrderType, "items" | "statusHistory"> & {
  items: OrderItemViewType[];
  statusHistory: OrderStatusChangeViewType[];
  itemsCount: number;
  totalLabel: string;
  createdAtLabel: string;
};

export type OrderFormItemType = {
  productId: string;
  quantity: number;
};

export type OrderFormValuesType = {
  customerId: string;
  items: OrderFormItemType[];
  comment: string;
};

export type OrderRequest = {
  customerId: string;
  customerName: string;
  items: OrderItemType[];
  comment: string;
};

export type OrderStatusRequest = {
  status: OrderStatusType;
};

export type OrderResponse = OrderType;

export type OrdersListResponse = OrderType[];
