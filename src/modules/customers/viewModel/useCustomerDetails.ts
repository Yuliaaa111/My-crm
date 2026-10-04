import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { toCustomerView } from "../model/mappers";
import { useCustomerDeletion } from "./useCustomerDeletion";
import { useCustomersData } from "./useCustomersData";

export const useCustomerDetails = () => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  const { customers, isLoading, loadErrorMessage, reloadCustomers } =
    useCustomersData();
  const deletion = useCustomerDeletion(() =>
    navigate(ROUTES.customers, { replace: true }),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const customer = customers.find(({ id }) => id === customerId);

  return {
    customer: customer ? toCustomerView(customer) : null,
    isLoading,
    loadErrorMessage,
    reloadCustomers,
    deletion,
    isFormOpen,
    openEditForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    goToCustomersList: () => navigate(ROUTES.customers),
  };
};
