import { useState } from "react";

import { getErrorMessage } from "@/core/utils/getErrorMessage";
import { deleteCustomer } from "../model/customersApi";
import { useCustomersStore } from "../model/customersStore";
import { getCustomerFullName } from "../model/mappers";
import type { CustomerType } from "../model/types";

export const useCustomerDeletion = (onDeleted?: () => void) => {
  const removeCustomer = useCustomersStore((state) => state.removeCustomer);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerType | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionErrorMessage, setDeletionErrorMessage] = useState<
    string | null
  >(null);

  const requestDeletion = (customer: CustomerType) => {
    setDeletionErrorMessage(null);
    setCustomerToDelete(customer);
  };

  const cancelDeletion = () => setCustomerToDelete(null);

  const confirmDeletion = async (): Promise<void> => {
    if (!customerToDelete) {
      return;
    }

    setIsDeleting(true);
    setDeletionErrorMessage(null);

    try {
      await deleteCustomer(customerToDelete.id);
      removeCustomer(customerToDelete.id);
      setCustomerToDelete(null);
      onDeleted?.();
    } catch (error) {
      setDeletionErrorMessage(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    customerToDelete,
    deletionMessage: customerToDelete
      ? `Клиент «${getCustomerFullName(customerToDelete)}» будет удалён без возможности восстановления.`
      : "",
    isDeleting,
    deletionErrorMessage,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  };
};
