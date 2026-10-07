import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { buildDetailsPath } from "@/core/utils/buildDetailsPath";
import { formatCurrency } from "@/core/utils/formatCurrency";
import { pluralize } from "@/core/utils/pluralize";
import { getOrderTotal } from "../model/calculations";
import { CANCELLED_ORDER_STATUS, ORDER_COUNT_FORMS } from "../model/constants";
import { sortOrdersByNewest, toOrderView } from "../model/mappers";
import type { OrderType } from "../model/types";
import { useOrdersData } from "./useOrdersData";

export const useCustomerOrders = (customerId: string) => {
  const navigate = useNavigate();
  const { orders, isLoading, loadErrorMessage, reloadOrders } = useOrdersData();

  const customerOrders = useMemo(
    () =>
      sortOrdersByNewest(
        orders.filter((order) => order.customerId === customerId),
      ),
    [orders, customerId],
  );
  // Cancelled orders bring no money, so they are left out of the sum,
  // the same way the dashboard counts revenue.
  const totalSpent = customerOrders
    .filter(({ status }) => status !== CANCELLED_ORDER_STATUS)
    .reduce((total, order) => total + getOrderTotal(order), 0);

  return {
    customerOrders: customerOrders.map(toOrderView),
    summary: `${customerOrders.length} ${pluralize(customerOrders.length, ORDER_COUNT_FORMS)} на сумму ${formatCurrency(totalSpent)} без учёта отменённых`,
    hasOrders: customerOrders.length > 0,
    isLoading,
    loadErrorMessage,
    reloadOrders,
    openOrderDetails: (order: Pick<OrderType, "id">) =>
      navigate(buildDetailsPath(ROUTES.orders, order.id)),
  };
};
