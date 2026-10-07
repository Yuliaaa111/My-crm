import { type ChangeEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ALL_FILTER_VALUE } from "@/core/constants/filters";
import { ROUTES } from "@/core/constants/routes";
import { usePagination } from "@/core/hooks/usePagination";
import { buildDetailsPath } from "@/core/utils/buildDetailsPath";
import { getCountryName } from "@/core/utils/countries";
import { isOneOf } from "@/core/utils/isOneOf";
import { matchesSearchQuery } from "@/core/utils/matchesSearchQuery";
import { CUSTOMER_STATUS_FILTERS } from "../model/constants";
import { getCustomerFullName, toCustomerView } from "../model/mappers";
import type { CustomerStatusFilterType, CustomerType } from "../model/types";
import { useCustomerDeletion } from "./useCustomerDeletion";
import { useCustomersData } from "./useCustomersData";

const filterCustomers = (
  customers: CustomerType[],
  searchQuery: string,
  statusFilter: CustomerStatusFilterType,
): CustomerType[] =>
  customers.filter(
    (customer) =>
      (statusFilter === ALL_FILTER_VALUE || customer.status === statusFilter) &&
      matchesSearchQuery(
        [
          getCustomerFullName(customer),
          customer.email,
          customer.phone,
          customer.company,
          customer.city,
          getCountryName(customer.countryCode),
          customer.countryCode,
        ],
        searchQuery,
      ),
  );

export const useCustomersList = () => {
  const navigate = useNavigate();
  const { customers, isLoading, loadErrorMessage, reloadCustomers } =
    useCustomersData();
  const deletion = useCustomerDeletion();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<CustomerStatusFilterType>(ALL_FILTER_VALUE);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(
    null,
  );

  const filteredCustomers = useMemo(
    () => filterCustomers(customers, searchQuery, statusFilter),
    [customers, searchQuery, statusFilter],
  );
  const { page, pageCount, pageItems, setPage, resetPage } =
    usePagination(filteredCustomers);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    resetPage();
  };

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;

    if (isOneOf(selectedFilter, CUSTOMER_STATUS_FILTERS)) {
      setStatusFilter(selectedFilter);
      resetPage();
    }
  };

  const openCreateForm = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const openEditForm = (customer: CustomerType) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const openCustomerDetails = (customer: CustomerType) =>
    navigate(buildDetailsPath(ROUTES.customers, customer.id));

  return {
    pageCustomers: pageItems.map(toCustomerView),
    filteredCount: filteredCustomers.length,
    totalCount: customers.length,
    isLoading,
    loadErrorMessage,
    reloadCustomers,
    searchQuery,
    statusFilter,
    page,
    pageCount,
    setPage,
    isFormOpen,
    editingCustomer,
    deletion,
    handleSearchChange,
    handleStatusFilterChange,
    openCreateForm,
    openEditForm,
    closeForm,
    openCustomerDetails,
  };
};
