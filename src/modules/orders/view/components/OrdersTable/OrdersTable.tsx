import { css } from "@emotion/css";
import { Trash2 } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { IconButton } from "@/core/ui/IconButton/IconButton";
import { Table, type TableColumnType } from "@/core/ui/Table/Table";
import type { OrderViewType } from "../../../model/types";
import { OrderStatusBadge } from "../OrderStatusBadge/OrderStatusBadge";

import { useStyles } from "./OrdersTable.styles";

type OrdersTableProps = {
  orders: OrderViewType[];
  emptyMessage: string;
  onOpen: (order: OrderViewType) => void;
  onDelete?: (order: OrderViewType) => void;
};

export const OrdersTable = ({
  orders,
  emptyMessage,
  onOpen,
  onDelete,
}: OrdersTableProps) => {
  const styles = useStyles();

  const columns: TableColumnType<OrderViewType>[] = [
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
      key: "createdAt",
      header: "Дата",
      renderCell: ({ createdAtLabel }) => createdAtLabel,
    },
    {
      key: "itemsCount",
      header: "Товаров, шт.",
      isRightAligned: true,
      renderCell: ({ itemsCount }) => itemsCount,
    },
    {
      key: "total",
      header: "Сумма",
      isRightAligned: true,
      renderCell: ({ totalLabel }) => (
        <span className={css(styles.total)}>{totalLabel}</span>
      ),
    },
    {
      key: "status",
      header: "Статус",
      renderCell: ({ status }) => <OrderStatusBadge status={status} />,
    },
  ];

  const deleteColumn: TableColumnType<OrderViewType> = {
    key: "actions",
    header: "",
    isRightAligned: true,
    renderCell: (order) => (
      <IconButton
        label="Удалить"
        onClick={(event) => {
          event.stopPropagation();
          onDelete?.(order);
        }}
      >
        <Trash2 size={ICON_SIZE} />
      </IconButton>
    ),
  };

  return (
    <Table
      columns={onDelete ? [...columns, deleteColumn] : columns}
      rows={orders}
      getRowKey={({ id }) => id}
      emptyMessage={emptyMessage}
      onRowClick={onOpen}
    />
  );
};
