import { css } from "@emotion/css";

import { Button } from "@/core/ui/Button/Button";
import { Card } from "@/core/ui/Card/Card";
import { Loader } from "@/core/ui/Loader/Loader";
import { useCustomerOrders } from "../../../viewModel/useCustomerOrders";
import { OrdersTable } from "../OrdersTable/OrdersTable";

import { useStyles } from "./CustomerOrdersSection.styles";

type CustomerOrdersSectionProps = {
  customerId: string;
};

export const CustomerOrdersSection = ({
  customerId,
}: CustomerOrdersSectionProps) => {
  const styles = useStyles();
  const {
    customerOrders,
    summary,
    hasOrders,
    isLoading,
    loadErrorMessage,
    reloadOrders,
    openOrderDetails,
  } = useCustomerOrders(customerId);

  const renderContent = () => {
    if (isLoading) {
      return <Loader label="Загружаем заказы…" />;
    }

    if (loadErrorMessage) {
      return (
        <div className={css(styles.error)} role="alert">
          Не удалось загрузить заказы: {loadErrorMessage}
          <Button variant="secondary" onClick={reloadOrders}>
            Повторить
          </Button>
        </div>
      );
    }

    if (!hasOrders) {
      return <p className={css(styles.message)}>У клиента пока нет заказов.</p>;
    }

    return (
      <OrdersTable
        orders={customerOrders}
        emptyMessage="У клиента пока нет заказов."
        onOpen={openOrderDetails}
      />
    );
  };

  return (
    <Card>
      <div className={css(styles.header)}>
        <h2 className={css(styles.title)}>Заказы клиента</h2>
        {!isLoading && !loadErrorMessage && hasOrders ? (
          <span className={css(styles.summary)}>{summary}</span>
        ) : null}
      </div>
      {renderContent()}
    </Card>
  );
};
