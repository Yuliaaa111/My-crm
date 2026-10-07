import { css } from "@emotion/css";

import { Table, type TableColumnType } from "@/core/ui/Table/Table";
import type { OrderItemViewType } from "../../../model/types";

import { useStyles } from "./OrderItemsTable.styles";

type OrderItemsTableProps = {
  items: OrderItemViewType[];
  totalLabel: string;
};

export const OrderItemsTable = ({
  items,
  totalLabel,
}: OrderItemsTableProps) => {
  const styles = useStyles();

  const columns: TableColumnType<OrderItemViewType>[] = [
    {
      key: "product",
      header: "Товар",
      renderCell: ({ productName, sku }) => (
        <>
          <div>{productName}</div>
          <div className={css(styles.sku)}>{sku}</div>
        </>
      ),
    },
    {
      key: "unitPrice",
      header: "Цена",
      isRightAligned: true,
      renderCell: ({ unitPriceLabel }) => unitPriceLabel,
    },
    {
      key: "quantity",
      header: "Кол-во",
      isRightAligned: true,
      renderCell: ({ quantity }) => quantity,
    },
    {
      key: "lineTotal",
      header: "Сумма",
      isRightAligned: true,
      renderCell: ({ lineTotalLabel }) => lineTotalLabel,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        rows={items}
        getRowKey={({ productId }) => productId}
        emptyMessage="В заказе нет позиций"
      />
      <div className={css(styles.total)}>
        <span>Итого</span>
        <span>{totalLabel}</span>
      </div>
    </>
  );
};
