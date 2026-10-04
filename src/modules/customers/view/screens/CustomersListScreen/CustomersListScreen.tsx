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
import { CUSTOMER_STATUS_FILTER_OPTIONS } from "../../../model/constants";
import { useCustomersList } from "../../../viewModel/useCustomersList";
import { CustomerFormModal } from "../../components/CustomerFormModal/CustomerFormModal";
import { CustomersTable } from "../../components/CustomersTable/CustomersTable";

export const CustomersListScreen = () => {
  const {
    pageCustomers,
    filteredCount,
    totalCount,
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
  } = useCustomersList();

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (loadErrorMessage) {
      return (
        <EmptyState
          title="Не удалось загрузить клиентов"
          description={loadErrorMessage}
          action={<Button onClick={reloadCustomers}>Повторить</Button>}
        />
      );
    }

    return (
      <>
        <Toolbar>
          <Input
            type="search"
            placeholder="Поиск по имени, email, телефону, компании или городу"
            aria-label="Поиск клиентов"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select
            aria-label="Фильтр по статусу"
            options={CUSTOMER_STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={handleStatusFilterChange}
          />
        </Toolbar>
        <CustomersTable
          customers={pageCustomers}
          onOpen={openCustomerDetails}
          onEdit={openEditForm}
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
        title="Клиенты"
        description={
          isLoading ? null : `Показано ${filteredCount} из ${totalCount}`
        }
        actions={
          <Button onClick={openCreateForm}>
            <Plus size={ICON_SIZE} />
            Добавить клиента
          </Button>
        }
      />
      {renderContent()}
      {isFormOpen ? (
        <CustomerFormModal
          editingCustomer={editingCustomer}
          onClose={closeForm}
        />
      ) : null}
      {deletion.customerToDelete ? (
        <ConfirmDialog
          title="Удалить клиента?"
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
