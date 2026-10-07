import { css } from "@emotion/css";

import { Button } from "@/core/ui/Button/Button";
import { Card } from "@/core/ui/Card/Card";
import { Table, type TableColumnType } from "@/core/ui/Table/Table";
import { OrderStatusBadge } from "@/modules/orders/public";
import type { RecentOrderType } from "../../../model/types";

import { useStyles } from "./RecentOrdersCard.styles";

type RecentOrdersCardProps = {
  orders: RecentOrderType[];
  onOpenOrder: (order: RecentOrderType) => void;
  onOpenAll: () => void;
};

export const RecentOrdersCard = ({
  orders,
  onOpenOrder,
  onOpenAll,
}: RecentOrdersCardProps) => {
  const styles = useStyles();

  const columns: TableColumnType<RecentOrderType>[] = [
    {
      key: "number",
      header: "Номер",
      renderCell: ({ number }) => (
        <span className={css(styles.number)}>{number}</span>
      ),
    },
    {
      key: "customer",
      header: "Клиент",
      renderCell: ({ customerName }) => customerName,
    },
    {
      key: "date",
      header: "Дата",
      renderCell: ({ createdAtLabel }) => createdAtLabel,
    },
    {
      key: "total",
      header: "Сумма",
      isRightAligned: true,
      renderCell: ({ totalLabel }) => totalLabel,
    },
    {
      key: "status",
      header: "Статус",
      renderCell: ({ status }) => <OrderStatusBadge status={status} />,
    },
  ];

  return (
    <Card>
      <div className={css(styles.header)}>
        <h2 className={css(styles.title)}>Последние заказы</h2>
        <Button variant="secondary" onClick={onOpenAll}>
          Все заказы
        </Button>
      </div>
      <Table
        columns={columns}
        rows={orders}
        getRowKey={({ id }) => id}
        emptyMessage="Заказов пока нет"
        onRowClick={onOpenOrder}
      />
    </Card>
  );
};
