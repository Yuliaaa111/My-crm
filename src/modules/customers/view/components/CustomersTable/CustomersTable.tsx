import { css } from "@emotion/css";
import { Pencil, Trash2 } from "lucide-react";

import { EMPTY_VALUE_PLACEHOLDER } from "@/core/constants/app";
import { ICON_SIZE } from "@/core/constants/layout";
import { IconButton } from "@/core/ui/IconButton/IconButton";
import { Table, type TableColumnType } from "@/core/ui/Table/Table";
import type { CustomerViewType } from "../../../model/types";
import { CustomerStatusBadge } from "../CustomerStatusBadge/CustomerStatusBadge";

import { useStyles } from "./CustomersTable.styles";

type CustomersTableProps = {
  customers: CustomerViewType[];
  onOpen: (customer: CustomerViewType) => void;
  onEdit: (customer: CustomerViewType) => void;
  onDelete: (customer: CustomerViewType) => void;
};

export const CustomersTable = ({
  customers,
  onOpen,
  onEdit,
  onDelete,
}: CustomersTableProps) => {
  const styles = useStyles();

  const columns: TableColumnType<CustomerViewType>[] = [
    {
      key: "name",
      header: "Клиент",
      renderCell: (customer) => (
        <>
          <div className={css(styles.name)}>{customer.fullName}</div>
          <div className={css(styles.secondaryLine)}>{customer.email}</div>
        </>
      ),
    },
    { key: "phone", header: "Телефон", renderCell: ({ phone }) => phone },
    {
      key: "company",
      header: "Компания",
      renderCell: ({ company }) => company || EMPTY_VALUE_PLACEHOLDER,
    },
    {
      key: "location",
      header: "Город и страна",
      renderCell: ({ city, countryName }) => (
        <>
          <div>{city}</div>
          <div className={css(styles.secondaryLine)}>{countryName}</div>
        </>
      ),
    },
    {
      key: "status",
      header: "Статус",
      renderCell: ({ status }) => <CustomerStatusBadge status={status} />,
    },
    {
      key: "actions",
      header: "",
      isRightAligned: true,
      renderCell: (customer) => (
        <div className={css(styles.actions)}>
          <IconButton
            label="Редактировать"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(customer);
            }}
          >
            <Pencil size={ICON_SIZE} />
          </IconButton>
          <IconButton
            label="Удалить"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(customer);
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
      rows={customers}
      getRowKey={({ id }) => id}
      emptyMessage="Клиенты не найдены. Измените условия поиска."
      onRowClick={onOpen}
    />
  );
};
