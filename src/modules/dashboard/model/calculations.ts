import { APP_LOCALE } from "@/core/constants/app";
import type { CustomerType } from "@/modules/customers/public";
import {
  CANCELLED_ORDER_STATUS,
  getOrderTotal,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  type OrderType,
} from "@/modules/orders/public";
import {
  getStockLevel,
  PRODUCT_CATEGORY_LABELS,
  type ProductType,
} from "@/modules/products/public";
import { ACTIVE_STATUS, UNKNOWN_CATEGORY_LABEL } from "./constants";

type CountByKeyType = { key: string; label: string; value: number };

const IN_STOCK_LEVEL = "inStock";
const MONTH_KEY_LENGTH = "YYYY-MM".length;

const monthFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  month: "short",
  timeZone: "UTC",
});

const getPaidOrders = (orders: OrderType[]): OrderType[] =>
  orders.filter(({ status }) => status !== CANCELLED_ORDER_STATUS);

export const calculateRevenue = (orders: OrderType[]): number =>
  getPaidOrders(orders).reduce(
    (total, order) => total + getOrderTotal(order),
    0,
  );

export const countActiveCustomers = (customers: CustomerType[]): number =>
  customers.filter(({ status }) => status === ACTIVE_STATUS).length;

export const countLowStockProducts = (products: ProductType[]): number =>
  products.filter(
    ({ status, stock }) =>
      status === ACTIVE_STATUS && getStockLevel(stock) !== IN_STOCK_LEVEL,
  ).length;

export const countOrdersByStatus = (orders: OrderType[]): CountByKeyType[] =>
  ORDER_STATUSES.map((status) => ({
    key: status,
    label: ORDER_STATUS_LABELS[status],
    value: orders.filter((order) => order.status === status).length,
  }));

const toMonthKey = (isoDate: string): string =>
  isoDate.slice(0, MONTH_KEY_LENGTH);

const getMonthKeysBetween = (firstKey: string, lastKey: string): string[] => {
  const monthKeys: string[] = [];
  const cursor = new Date(`${firstKey}-01T00:00:00.000Z`);

  while (toMonthKey(cursor.toISOString()) <= lastKey) {
    monthKeys.push(toMonthKey(cursor.toISOString()));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return monthKeys;
};

// Every month between the first and the last order gets a bar, so a
// month without orders shows up as zero instead of silently disappearing.
export const countOrdersByMonth = (orders: OrderType[]): CountByKeyType[] => {
  const orderMonthKeys = orders.map(({ createdAt }) => toMonthKey(createdAt));

  if (orderMonthKeys.length === 0) {
    return [];
  }

  const sortedMonthKeys = [...orderMonthKeys].sort();
  const monthKeys = getMonthKeysBetween(
    sortedMonthKeys[0],
    sortedMonthKeys[sortedMonthKeys.length - 1],
  );

  return monthKeys.map((monthKey) => ({
    key: monthKey,
    label: monthFormatter.format(new Date(`${monthKey}-01T00:00:00.000Z`)),
    value: orderMonthKeys.filter((orderMonthKey) => orderMonthKey === monthKey)
      .length,
  }));
};

export const calculateRevenueByCategory = (
  orders: OrderType[],
  products: ProductType[],
): CountByKeyType[] => {
  const revenueByCategory = new Map<string, number>();

  getPaidOrders(orders).forEach(({ items }) => {
    items.forEach(({ productId, unitPrice, quantity }) => {
      const product = products.find(({ id }) => id === productId);
      const categoryLabel = product
        ? PRODUCT_CATEGORY_LABELS[product.category]
        : UNKNOWN_CATEGORY_LABEL;

      revenueByCategory.set(
        categoryLabel,
        (revenueByCategory.get(categoryLabel) ?? 0) + unitPrice * quantity,
      );
    });
  });

  return [...revenueByCategory.entries()]
    .map(([label, value]) => ({ key: label, label, value }))
    .sort((first, second) => second.value - first.value);
};

export const getRecentOrders = (
  orders: OrderType[],
  limit: number,
): OrderType[] =>
  [...orders]
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .slice(0, limit);
