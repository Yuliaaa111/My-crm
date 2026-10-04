import { create } from "zustand";

import { LOAD_STATUS } from "@/core/constants/loadStatus";
import type { LoadStatusType } from "@/core/types";
import type { CustomerType } from "./types";

type CustomersStoreType = {
  customers: CustomerType[];
  loadStatus: LoadStatusType;
  loadErrorMessage: string | null;
  startLoading: () => void;
  setCustomers: (customers: CustomerType[]) => void;
  setLoadError: (errorMessage: string) => void;
  saveCustomer: (customer: CustomerType) => void;
  removeCustomer: (customerId: string) => void;
};

export const useCustomersStore = create<CustomersStoreType>()((set) => ({
  customers: [],
  loadStatus: LOAD_STATUS.idle,
  loadErrorMessage: null,
  startLoading: () =>
    set({ loadStatus: LOAD_STATUS.loading, loadErrorMessage: null }),
  setCustomers: (customers) =>
    set({ customers, loadStatus: LOAD_STATUS.success }),
  setLoadError: (loadErrorMessage) =>
    set({ loadStatus: LOAD_STATUS.error, loadErrorMessage }),
  saveCustomer: (savedCustomer) =>
    set(({ customers }) => ({
      customers: customers.some(({ id }) => id === savedCustomer.id)
        ? customers.map((customer) =>
            customer.id === savedCustomer.id ? savedCustomer : customer,
          )
        : [savedCustomer, ...customers],
    })),
  removeCustomer: (customerId) =>
    set(({ customers }) => ({
      customers: customers.filter(({ id }) => id !== customerId),
    })),
}));
