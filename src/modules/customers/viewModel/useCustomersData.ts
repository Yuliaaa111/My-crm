import { useEffect } from "react";

import { LOAD_STATUS } from "@/core/constants/loadStatus";
import { getErrorMessage } from "@/core/utils/getErrorMessage";
import { fetchCustomers } from "../model/customersApi";
import { useCustomersStore } from "../model/customersStore";

const loadCustomers = async (): Promise<void> => {
  const { startLoading, setCustomers, setLoadError } =
    useCustomersStore.getState();

  startLoading();

  try {
    setCustomers(await fetchCustomers());
  } catch (error) {
    setLoadError(getErrorMessage(error));
  }
};

export const useCustomersData = () => {
  const customers = useCustomersStore((state) => state.customers);
  const loadStatus = useCustomersStore((state) => state.loadStatus);
  const loadErrorMessage = useCustomersStore((state) => state.loadErrorMessage);

  useEffect(() => {
    // Read the status at call time: several screens may mount at once,
    // and only the first of them should start the request.
    if (useCustomersStore.getState().loadStatus === LOAD_STATUS.idle) {
      loadCustomers();
    }
  }, []);

  return {
    customers,
    isLoading:
      loadStatus === LOAD_STATUS.idle || loadStatus === LOAD_STATUS.loading,
    loadErrorMessage,
    reloadCustomers: loadCustomers,
  };
};
