import { create } from "zustand";

import { LOAD_STATUS } from "@/core/constants/loadStatus";
import type { LoadStatusType } from "@/core/types";
import type { OrderType } from "./types";

type OrdersStoreType = {
  orders: OrderType[];
  loadStatus: LoadStatusType;
  loadErrorMessage: string | null;
  startLoading: () => void;
  setOrders: (orders: OrderType[]) => void;
  setLoadError: (errorMessage: string) => void;
  saveOrder: (order: OrderType) => void;
  removeOrder: (orderId: string) => void;
};

export const useOrdersStore = create<OrdersStoreType>()((set) => ({
  orders: [],
  loadStatus: LOAD_STATUS.idle,
  loadErrorMessage: null,
  startLoading: () =>
    set({ loadStatus: LOAD_STATUS.loading, loadErrorMessage: null }),
  setOrders: (orders) => set({ orders, loadStatus: LOAD_STATUS.success }),
  setLoadError: (loadErrorMessage) =>
    set({ loadStatus: LOAD_STATUS.error, loadErrorMessage }),
  saveOrder: (savedOrder) =>
    set(({ orders }) => ({
      orders: orders.some(({ id }) => id === savedOrder.id)
        ? orders.map((order) =>
            order.id === savedOrder.id ? savedOrder : order,
          )
        : [savedOrder, ...orders],
    })),
  removeOrder: (orderId) =>
    set(({ orders }) => ({
      orders: orders.filter(({ id }) => id !== orderId),
    })),
}));
