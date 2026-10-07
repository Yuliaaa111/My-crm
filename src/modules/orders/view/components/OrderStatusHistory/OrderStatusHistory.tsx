import { css } from "@emotion/css";

import type { OrderStatusChangeViewType } from "../../../model/types";
import { OrderStatusBadge } from "../OrderStatusBadge/OrderStatusBadge";

import { useStyles } from "./OrderStatusHistory.styles";

type OrderStatusHistoryProps = {
  statusHistory: OrderStatusChangeViewType[];
};

export const OrderStatusHistory = ({
  statusHistory,
}: OrderStatusHistoryProps) => {
  const styles = useStyles();

  return (
    <ol className={css(styles.list)}>
      {statusHistory.map(({ status, changedAt, changedAtLabel }) => (
        <li key={`${status}-${changedAt}`} className={css(styles.item)}>
          <OrderStatusBadge status={status} />
          <span className={css(styles.date)}>{changedAtLabel}</span>
        </li>
      ))}
    </ol>
  );
};
