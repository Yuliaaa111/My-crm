import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { EMPTY_VALUE_PLACEHOLDER } from "@/core/constants/app";
import { ICON_SIZE } from "@/core/constants/layout";
import { Button } from "@/core/ui/Button/Button";
import { Card } from "@/core/ui/Card/Card";
import { ConfirmDialog } from "@/core/ui/ConfirmDialog/ConfirmDialog";
import { DescriptionList } from "@/core/ui/DescriptionList/DescriptionList";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";
import { IconButton } from "@/core/ui/IconButton/IconButton";
import { Loader } from "@/core/ui/Loader/Loader";
import { PageHeader } from "@/core/ui/PageHeader/PageHeader";
import { CUSTOMER_NOT_FOUND_MESSAGE } from "../../../model/constants";
import { useCustomerDetails } from "../../../viewModel/useCustomerDetails";
import { CustomerFormModal } from "../../components/CustomerFormModal/CustomerFormModal";
import { CustomerStatusBadge } from "../../components/CustomerStatusBadge/CustomerStatusBadge";

export const CustomerDetailsScreen = () => {
  const {
    customer,
    isLoading,
    loadErrorMessage,
    reloadCustomers,
    deletion,
    isFormOpen,
    openEditForm,
    closeForm,
    goToCustomersList,
  } = useCustomerDetails();

  if (isLoading) {
    return <Loader />;
  }

  if (loadErrorMessage) {
    return (
      <EmptyState
        title="Не удалось загрузить клиента"
        description={loadErrorMessage}
        action={<Button onClick={reloadCustomers}>Повторить</Button>}
      />
    );
  }

  if (!customer) {
    return (
      <EmptyState
        title={CUSTOMER_NOT_FOUND_MESSAGE}
        description="Возможно, клиент был удалён или ссылка неверна."
        action={<Button onClick={goToCustomersList}>К списку клиентов</Button>}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={customer.fullName}
        description={<CustomerStatusBadge status={customer.status} />}
        leading={
          <IconButton label="К списку клиентов" onClick={goToCustomersList}>
            <ArrowLeft size={ICON_SIZE} />
          </IconButton>
        }
        actions={
          <>
            <Button variant="secondary" onClick={openEditForm}>
              <Pencil size={ICON_SIZE} />
              Редактировать
            </Button>
            <Button
              variant="danger"
              onClick={() => deletion.requestDeletion(customer)}
            >
              <Trash2 size={ICON_SIZE} />
              Удалить
            </Button>
          </>
        }
      />
      <Card>
        <DescriptionList
          items={[
            { label: "Email", value: customer.email },
            { label: "Телефон", value: customer.phone },
            {
              label: "Компания",
              value: customer.company || EMPTY_VALUE_PLACEHOLDER,
            },
            { label: "Город и страна", value: customer.location },
            { label: "Клиент с", value: customer.createdAtLabel },
          ]}
        />
      </Card>
      {isFormOpen ? (
        <CustomerFormModal editingCustomer={customer} onClose={closeForm} />
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
