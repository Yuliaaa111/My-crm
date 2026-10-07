import { css } from "@emotion/css";
import { Pencil, Trash2 } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { IconButton } from "@/core/ui/IconButton/IconButton";
import { Table, type TableColumnType } from "@/core/ui/Table/Table";
import type { ProductViewType } from "../../../model/types";
import { ProductStatusBadge } from "../ProductStatusBadge/ProductStatusBadge";
import { StockLevelBadge } from "../StockLevelBadge/StockLevelBadge";

import { useStyles } from "./ProductsTable.styles";

type ProductsTableProps = {
  products: ProductViewType[];
  onOpen: (product: ProductViewType) => void;
  onEdit: (product: ProductViewType) => void;
  onDelete: (product: ProductViewType) => void;
};

export const ProductsTable = ({
  products,
  onOpen,
  onEdit,
  onDelete,
}: ProductsTableProps) => {
  const styles = useStyles();

  const columns: TableColumnType<ProductViewType>[] = [
    {
      key: "name",
      header: "Товар",
      renderCell: ({ name, sku }) => (
        <>
          <div className={css(styles.name)}>{name}</div>
          <div className={css(styles.sku)}>{sku}</div>
        </>
      ),
    },
    {
      key: "category",
      header: "Категория",
      renderCell: ({ categoryLabel }) => categoryLabel,
    },
    {
      key: "price",
      header: "Цена",
      isRightAligned: true,
      renderCell: ({ priceLabel }) => priceLabel,
    },
    {
      key: "stock",
      header: "Остаток",
      renderCell: ({ stock, stockLevel }) => (
        <span className={css(styles.stock)}>
          {stock} шт.
          <StockLevelBadge stockLevel={stockLevel} />
        </span>
      ),
    },
    {
      key: "status",
      header: "Статус",
      renderCell: ({ status }) => <ProductStatusBadge status={status} />,
    },
    {
      key: "actions",
      header: "",
      isRightAligned: true,
      renderCell: (product) => (
        <div className={css(styles.actions)}>
          <IconButton
            label="Редактировать"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(product);
            }}
          >
            <Pencil size={ICON_SIZE} />
          </IconButton>
          <IconButton
            label="Удалить"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(product);
            }}
          >
            <Trash2 size={ICON_SIZE} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={products}
      getRowKey={({ id }) => id}
      emptyMessage="Товары не найдены. Измените условия поиска."
      onRowClick={onOpen}
    />
  );
};
