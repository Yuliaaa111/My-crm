import { type ChangeEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ALL_FILTER_VALUE } from "@/core/constants/filters";
import { ROUTES } from "@/core/constants/routes";
import { usePagination } from "@/core/hooks/usePagination";
import { buildDetailsPath } from "@/core/utils/buildDetailsPath";
import { isOneOf } from "@/core/utils/isOneOf";
import { matchesSearchQuery } from "@/core/utils/matchesSearchQuery";
import { ORDER_STATUS_FILTERS } from "../model/constants";
import { sortOrdersByNewest, toOrderView } from "../model/mappers";
import type { OrderStatusFilterType, OrderType } from "../model/types";
import { useOrderDeletion } from "./useOrderDeletion";
import { useOrdersData } from "./useOrdersData";

const filterOrders = (
  orders: OrderType[],
  searchQuery: string,
  statusFilter: OrderStatusFilterType,
): OrderType[] =>
  sortOrdersByNewest(orders).filter(
    (order) =>
      (statusFilter === ALL_FILTER_VALUE || order.status === statusFilter) &&
      matchesSearchQuery([order.number, order.customerName], searchQuery),
  );

export const useOrdersList = () => {
  const navigate = useNavigate();
  const { orders, isLoading, loadErrorMessage, reloadOrders } = useOrdersData();
  const deletion = useOrderDeletion();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<OrderStatusFilterType>(ALL_FILTER_VALUE);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredOrders = useMemo(
    () => filterOrders(orders, searchQuery, statusFilter),
    [orders, searchQuery, statusFilter],
  );
  const { page, pageCount, pageItems, setPage, resetPage } =
    usePagination(filteredOrders);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    resetPage();
  };

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;

    if (isOneOf(selectedFilter, ORDER_STATUS_FILTERS)) {
      setStatusFilter(selectedFilter);
      resetPage();
    }
  };

  const openOrderDetails = (order: Pick<OrderType, "id">) =>
    navigate(buildDetailsPath(ROUTES.orders, order.id));

  return {
    pageOrders: pageItems.map(toOrderView),
    filteredCount: filteredOrders.length,
    totalCount: orders.length,
    isLoading,
    loadErrorMessage,
    reloadOrders,
    searchQuery,
    statusFilter,
    page,
    pageCount,
    setPage,
    isFormOpen,
    deletion,
    handleSearchChange,
    handleStatusFilterChange,
    openCreateForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    openOrderDetails,
  };
};
