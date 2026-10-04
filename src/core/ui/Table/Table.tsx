import { css } from "@emotion/css";
import type { KeyboardEvent, ReactNode } from "react";

import { useStyles } from "./Table.styles";

export type TableColumnType<Row> = {
  key: string;
  header: string;
  isRightAligned?: boolean;
  renderCell: (row: Row) => ReactNode;
};

type TableProps<Row> = {
  columns: TableColumnType<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string;
  emptyMessage: string;
  onRowClick?: (row: Row) => void;
};

const ACTIVATION_KEY = "Enter";

export const Table = <Row,>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
  onRowClick,
}: TableProps<Row>) => {
  const styles = useStyles(Boolean(onRowClick));

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    row: Row,
  ) => {
    if (event.key === ACTIVATION_KEY && event.target === event.currentTarget) {
      onRowClick?.(row);
    }
  };

  return (
    <div className={css(styles.wrapper)}>
      <table className={css(styles.table)}>
        <thead>
          <tr>
            {columns.map(({ key, header, isRightAligned }) => (
              <th
                key={key}
                className={css(
                  styles.headerCell,
                  isRightAligned && styles.rightAligned,
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={css(styles.emptyMessage)} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className={css(styles.row)}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => handleRowKeyDown(event, row)
                    : undefined
                }
              >
                {columns.map(({ key, isRightAligned, renderCell }) => (
                  <td
                    key={key}
                    className={css(
                      styles.cell,
                      isRightAligned && styles.rightAligned,
                    )}
                  >
                    {renderCell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
