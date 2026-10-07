import { Plus } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { Button } from "@/core/ui/Button/Button";
import { ConfirmDialog } from "@/core/ui/ConfirmDialog/ConfirmDialog";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";
import { Input } from "@/core/ui/Input/Input";
import { Loader } from "@/core/ui/Loader/Loader";
import { PageHeader } from "@/core/ui/PageHeader/PageHeader";
import { Pagination } from "@/core/ui/Pagination/Pagination";
import { Select } from "@/core/ui/Select/Select";
import { Toolbar } from "@/core/ui/Toolbar/Toolbar";
import { ORDER_STATUS_FILTER_OPTIONS } from "../../../model/constants";
import { useOrdersList } from "../../../viewModel/useOrdersList";
import { OrderFormModal } from "../../components/OrderFormModal/OrderFormModal";
import { OrdersTable } from "../../components/OrdersTable/OrdersTable";

export const OrdersListScreen = () => {
  const {
    pageOrders,
    filteredCount,
    totalCount,
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
    openCreateForm,
    closeForm,
    openOrderDetails,
  } = useOrdersList();

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (loadErrorMessage) {
      return (
        <EmptyState
          title="Не удалось загрузить заказы"
          description={loadErrorMessage}
          action={<Button onClick={reloadOrders}>Повторить</Button>}
        />
      );
    }

    return (
      <>
        <Toolbar>
          <Input
            type="search"
            placeholder="Поиск по номеру заказа или клиенту"
            aria-label="Поиск заказов"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select
            aria-label="Фильтр по статусу"
            options={ORDER_STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={handleStatusFilterChange}
          />
        </Toolbar>
        <OrdersTable
          orders={pageOrders}
          emptyMessage="Заказы не найдены. Измените условия поиска."
          onOpen={openOrderDetails}
          onDelete={deletion.requestDeletion}
        />
        {pageCount > 1 ? (
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        ) : null}
      </>
    );
  };

  return (
    <>
      <PageHeader
        title="Заказы"
        description={
          isLoading ? null : `Показано ${filteredCount} из ${totalCount}`
        }
        actions={
          <Button onClick={openCreateForm}>
            <Plus size={ICON_SIZE} />
            Новый заказ
          </Button>
        }
      />
      {renderContent()}
      {isFormOpen ? (
        <OrderFormModal onClose={closeForm} onCreated={openOrderDetails} />
      ) : null}
      {deletion.orderToDelete ? (
        <ConfirmDialog
          title="Удалить заказ?"
          message={deletion.deletionMessage}
          confirmLabel="Удалить"
          isConfirming={deletion.isDeleting}
          errorMessage={deletion.deletionErrorMessage}
          onConfirm={deletion.confirmDeletion}
          onCancel={deletion.cancelDeletion}
        />
      ) : null}
    </>
  );
};
