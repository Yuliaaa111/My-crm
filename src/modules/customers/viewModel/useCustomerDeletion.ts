import { useConfirmedDeletion } from "@/core/hooks/useConfirmedDeletion";
import { deleteCustomer } from "../model/customersApi";
import { useCustomersStore } from "../model/customersStore";
import { getCustomerFullName } from "../model/mappers";
import type { CustomerType } from "../model/types";

export const useCustomerDeletion = (onDeleted?: () => void) => {
  const removeCustomer = useCustomersStore((state) => state.removeCustomer);
  const { itemToDelete, ...deletion } = useConfirmedDeletion(
    async (customer: CustomerType) => {
      await deleteCustomer(customer.id);
      removeCustomer(customer.id);
      onDeleted?.();
    },
  );

  return {
    ...deletion,
    customerToDelete: itemToDelete,
    deletionMessage: itemToDelete
      ? `Клиент «${getCustomerFullName(itemToDelete)}» будет удалён без возможности восстановления.`
      : "",
  };
};
