import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { getErrorMessage } from "@/core/utils/getErrorMessage";
import {
  CUSTOMER_STATUS_OPTIONS,
  customerFormDefaultValues,
} from "../model/constants";
import { createCustomer, updateCustomer } from "../model/customersApi";
import { useCustomersStore } from "../model/customersStore";
import { toCustomerRequest } from "../model/mappers";
import { customerSchema } from "../model/schema";
import type { CustomerRequest, CustomerType } from "../model/types";

export const useCustomerForm = (
  editingCustomer: CustomerType | null,
  onSaved: () => void,
) => {
  const saveCustomer = useCustomersStore((state) => state.saveCustomer);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerRequest>({
    resolver: zodResolver(customerSchema),
    defaultValues: editingCustomer
      ? toCustomerRequest(editingCustomer)
      : customerFormDefaultValues,
  });

  const submitCustomer = async (request: CustomerRequest): Promise<void> => {
    setSubmitErrorMessage(null);

    try {
      const savedCustomer = editingCustomer
        ? await updateCustomer(editingCustomer.id, request)
        : await createCustomer(request);
      saveCustomer(savedCustomer);
      onSaved();
    } catch (error) {
      setSubmitErrorMessage(getErrorMessage(error));
    }
  };

  return {
    register,
    errors,
    isSubmitting,
    submitErrorMessage,
    isEditing: editingCustomer !== null,
    statusOptions: CUSTOMER_STATUS_OPTIONS,
    handleFormSubmit: handleSubmit(submitCustomer),
  };
};
