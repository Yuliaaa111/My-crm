import { useEffect } from "react";

import { LOAD_STATUS } from "@/core/constants/loadStatus";
import { getErrorMessage } from "@/core/utils/getErrorMessage";
import { fetchOrders } from "../model/ordersApi";
import { useOrdersStore } from "../model/ordersStore";

const loadOrders = async (): Promise<void> => {
  const { startLoading, setOrders, setLoadError } = useOrdersStore.getState();

  startLoading();

  try {
    setOrders(await fetchOrders());
  } catch (error) {
    setLoadError(getErrorMessage(error));
  }
};

export const useOrdersData = () => {
  const orders = useOrdersStore((state) => state.orders);
  const loadStatus = useOrdersStore((state) => state.loadStatus);
  const loadErrorMessage = useOrdersStore((state) => state.loadErrorMessage);

  useEffect(() => {
    // Read the status at call time: several screens may mount at once,
    // and only the first of them should start the request.
    if (useOrdersStore.getState().loadStatus === LOAD_STATUS.idle) {
      loadOrders();
    }
  }, []);

  return {
    orders,
    isLoading:
      loadStatus === LOAD_STATUS.idle || loadStatus === LOAD_STATUS.loading,
    loadErrorMessage,
    reloadOrders: loadOrders,
  };
};
