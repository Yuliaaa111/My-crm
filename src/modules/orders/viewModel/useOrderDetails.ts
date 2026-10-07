import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { buildDetailsPath } from "@/core/utils/buildDetailsPath";
import { getErrorMessage } from "@/core/utils/getErrorMessage";
import { loadProducts } from "@/modules/products/public";
import {
  CANCELLED_ORDER_STATUS,
  ORDER_STATUS_ACTION_LABELS,
  ORDER_STATUS_TRANSITIONS,
} from "../model/constants";
import { toOrderView } from "../model/mappers";
import { updateOrderStatus } from "../model/ordersApi";
import { useOrdersStore } from "../model/ordersStore";
import type { OrderStatusType } from "../model/types";
import { useOrderDeletion } from "./useOrderDeletion";
import { useOrdersData } from "./useOrdersData";

export const useOrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, isLoading, loadErrorMessage, reloadOrders } = useOrdersData();
  const saveOrder = useOrdersStore((state) => state.saveOrder);
  const deletion = useOrderDeletion(() =>
    navigate(ROUTES.orders, { replace: true }),
  );
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [statusErrorMessage, setStatusErrorMessage] = useState<string | null>(
    null,
  );
  const order = orders.find(({ id }) => id === orderId);

  const changeStatus = async (status: OrderStatusType): Promise<void> => {
    if (!order) {
      return;
    }

    setIsChangingStatus(true);
    setStatusErrorMessage(null);

    try {
      saveOrder(await updateOrderStatus(order.id, { status }));

      if (status === CANCELLED_ORDER_STATUS) {
        loadProducts();
      }
    } catch (error) {
      setStatusErrorMessage(getErrorMessage(error));
    } finally {
      setIsChangingStatus(false);
    }
  };

  return {
    order: order ? toOrderView(order) : null,
    statusActions: order
      ? ORDER_STATUS_TRANSITIONS[order.status].map((status) => ({
          status,
          label: ORDER_STATUS_ACTION_LABELS[status],
          isDestructive: status === CANCELLED_ORDER_STATUS,
        }))
      : [],
    isLoading,
    loadErrorMessage,
    reloadOrders,
    isChangingStatus,
    statusErrorMessage,
    changeStatus,
    deletion,
    goToOrdersList: () => navigate(ROUTES.orders),
    openCustomer: () => {
      if (order) {
        navigate(buildDetailsPath(ROUTES.customers, order.customerId));
      }
    },
  };
};
