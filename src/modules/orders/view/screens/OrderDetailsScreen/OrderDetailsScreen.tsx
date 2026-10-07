import { css } from "@emotion/css";
import { ArrowLeft, Trash2 } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { Button } from "@/core/ui/Button/Button";
import { Card } from "@/core/ui/Card/Card";
import { ConfirmDialog } from "@/core/ui/ConfirmDialog/ConfirmDialog";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";
import { IconButton } from "@/core/ui/IconButton/IconButton";
import { Loader } from "@/core/ui/Loader/Loader";
import { PageHeader } from "@/core/ui/PageHeader/PageHeader";
import { ORDER_NOT_FOUND_MESSAGE } from "../../../model/constants";
import { useOrderDetails } from "../../../viewModel/useOrderDetails";
import { OrderItemsTable } from "../../components/OrderItemsTable/OrderItemsTable";
import { OrderStatusBadge } from "../../components/OrderStatusBadge/OrderStatusBadge";
import { OrderStatusHistory } from "../../components/OrderStatusHistory/OrderStatusHistory";

import { useStyles } from "./OrderDetailsScreen.styles";

export const OrderDetailsScreen = () => {
  const styles = useStyles();
  const {
    order,
    statusActions,
    isLoading,
    loadErrorMessage,
    reloadOrders,
    isChangingStatus,
    statusErrorMessage,
    changeStatus,
    deletion,
    goToOrdersList,
    openCustomer,
  } = useOrderDetails();

  if (isLoading) {
    return <Loader />;
  }

  if (loadErrorMessage) {
    return (
      <EmptyState
        title="Не удалось загрузить заказ"
        description={loadErrorMessage}
        action={<Button onClick={reloadOrders}>Повторить</Button>}
      />
    );
  }

  if (!order) {
    return (
      <EmptyState
        title={ORDER_NOT_FOUND_MESSAGE}
        description="Возможно, заказ был удалён или ссылка неверна."
        action={<Button onClick={goToOrdersList}>К списку заказов</Button>}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={`Заказ ${order.number}`}
        description={`от ${order.createdAtLabel}`}
        leading={
          <IconButton label="К списку заказов" onClick={goToOrdersList}>
            <ArrowLeft size={ICON_SIZE} />
          </IconButton>
        }
        actions={
          <>
            <OrderStatusBadge status={order.status} />
            <Button
              variant="danger"
              onClick={() => deletion.requestDeletion(order)}
            >
              <Trash2 size={ICON_SIZE} />
              Удалить
            </Button>
          </>
        }
      />
      <div className={css(styles.layout)}>
        <div className={css(styles.column)}>
          <Card>
            <h2 className={css(styles.sectionTitle)}>Позиции</h2>
            <OrderItemsTable
              items={order.items}
              totalLabel={order.totalLabel}
            />
          </Card>
          {order.comment ? (
            <Card>
              <h2 className={css(styles.sectionTitle)}>Комментарий</h2>
              <p className={css(styles.comment)}>{order.comment}</p>
            </Card>
          ) : null}
        </div>
        <div className={css(styles.column)}>
          <Card>
            <h2 className={css(styles.sectionTitle)}>Клиент</h2>
            <p className={css(styles.customerName)}>{order.customerName}</p>
            <Button variant="secondary" onClick={openCustomer}>
              Открыть карточку клиента
            </Button>
          </Card>
          <Card>
            <h2 className={css(styles.sectionTitle)}>Статус</h2>
            {statusActions.length > 0 ? (
              <div className={css(styles.statusActions)}>
                {statusActions.map(({ status, label, isDestructive }) => (
                  <Button
                    key={status}
                    variant={isDestructive ? "secondary" : "primary"}
                    onClick={() => changeStatus(status)}
                    isDisabled={isChangingStatus}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            ) : (
              <p className={css(styles.finalStatus)}>
                Заказ закрыт, статус больше не меняется.
              </p>
            )}
            {statusErrorMessage ? (
              <p className={css(styles.statusError)} role="alert">
                {statusErrorMessage}
              </p>
            ) : null}
          </Card>
          <Card>
            <h2 className={css(styles.sectionTitle)}>История статусов</h2>
            <OrderStatusHistory statusHistory={order.statusHistory} />
          </Card>
        </div>
      </div>
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
