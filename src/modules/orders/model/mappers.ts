import { formatCurrency } from "@/core/utils/formatCurrency";
import { formatDate } from "@/core/utils/formatDate";
import { getItemsCount, getLineTotal, getOrderTotal } from "./calculations";
import type { OrderType, OrderViewType } from "./types";

export const toOrderView = (order: OrderType): OrderViewType => ({
  ...order,
  items: order.items.map((item) => ({
    ...item,
    unitPriceLabel: formatCurrency(item.unitPrice),
    lineTotalLabel: formatCurrency(getLineTotal(item)),
  })),
  statusHistory: order.statusHistory.map((statusChange) => ({
    ...statusChange,
    changedAtLabel: formatDate(statusChange.changedAt),
  })),
  itemsCount: getItemsCount(order),
  totalLabel: formatCurrency(getOrderTotal(order)),
  createdAtLabel: formatDate(order.createdAt),
});

export const sortOrdersByNewest = (orders: OrderType[]): OrderType[] =>
  [...orders].sort((firstOrder, secondOrder) =>
    secondOrder.createdAt.localeCompare(firstOrder.createdAt),
  );
