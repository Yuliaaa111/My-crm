import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { buildDetailsPath } from "@/core/utils/buildDetailsPath";
import { formatCurrency } from "@/core/utils/formatCurrency";
import { formatDate } from "@/core/utils/formatDate";
import { useCustomersData } from "@/modules/customers/public";
import { getOrderTotal, useOrdersData } from "@/modules/orders/public";
import { useProductsData } from "@/modules/products/public";
import {
  calculateRevenue,
  calculateRevenueByCategory,
  countActiveCustomers,
  countLowStockProducts,
  countOrdersByMonth,
  countOrdersByStatus,
  getRecentOrders,
} from "../model/calculations";
import { RECENT_ORDERS_LIMIT } from "../model/constants";
import type {
  ChartDatumType,
  RecentOrderType,
  StatTileType,
} from "../model/types";

const formatCount = (count: number): string => `${count} шт.`;

export const useDashboard = () => {
  const navigate = useNavigate();
  const customersData = useCustomersData();
  const productsData = useProductsData();
  const ordersData = useOrdersData();
  const { customers } = customersData;
  const { products } = productsData;
  const { orders } = ordersData;

  const dashboard = useMemo(() => {
    const statTiles: StatTileType[] = [
      {
        key: "revenue",
        label: "Выручка",
        value: formatCurrency(calculateRevenue(orders)),
        hint: "По всем заказам, кроме отменённых",
      },
      {
        key: "orders",
        label: "Заказы",
        value: String(orders.length),
        hint: "Всего, включая отменённые",
      },
      {
        key: "customers",
        label: "Активные клиенты",
        value: String(countActiveCustomers(customers)),
        hint: `Из ${customers.length} в базе`,
      },
      {
        key: "lowStock",
        label: "Товары с малым остатком",
        value: String(countLowStockProducts(products)),
        hint: "Мало на складе или нет в наличии",
      },
    ];

    const toCountData = (
      counts: { key: string; label: string; value: number }[],
      formatValue: (value: number) => string,
    ): ChartDatumType[] =>
      counts.map((count) => ({
        ...count,
        valueLabel: formatValue(count.value),
      }));

    const recentOrders: RecentOrderType[] = getRecentOrders(
      orders,
      RECENT_ORDERS_LIMIT,
    ).map((order) => ({
      id: order.id,
      number: order.number,
      customerName: order.customerName,
      createdAtLabel: formatDate(order.createdAt),
      totalLabel: formatCurrency(getOrderTotal(order)),
      status: order.status,
    }));

    return {
      statTiles,
      ordersByMonth: toCountData(countOrdersByMonth(orders), formatCount),
      ordersByStatus: toCountData(countOrdersByStatus(orders), formatCount),
      revenueByCategory: toCountData(
        calculateRevenueByCategory(orders, products),
        formatCurrency,
      ),
      recentOrders,
    };
  }, [customers, products, orders]);

  const loadErrorMessage =
    customersData.loadErrorMessage ??
    productsData.loadErrorMessage ??
    ordersData.loadErrorMessage;

  return {
    ...dashboard,
    isLoading:
      customersData.isLoading || productsData.isLoading || ordersData.isLoading,
    loadErrorMessage,
    reloadAll: () => {
      customersData.reloadCustomers();
      productsData.reloadProducts();
      ordersData.reloadOrders();
    },
    formatCount,
    formatCurrency,
    openOrder: (order: Pick<RecentOrderType, "id">) =>
      navigate(buildDetailsPath(ROUTES.orders, order.id)),
    openOrdersList: () => navigate(ROUTES.orders),
  };
};
