import type { OrderItemType, OrderType } from "./types";

export const getLineTotal = ({ unitPrice, quantity }: OrderItemType): number =>
  unitPrice * quantity;

export const getOrderTotal = ({ items }: Pick<OrderType, "items">): number =>
  items.reduce((total, item) => total + getLineTotal(item), 0);

export const getItemsCount = ({ items }: Pick<OrderType, "items">): number =>
  items.reduce((count, { quantity }) => count + quantity, 0);
