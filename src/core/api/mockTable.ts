import type { ZodType } from "zod";

import {
  MOCK_STORAGE_PREFIX,
  MOCK_STORAGE_VERSION,
} from "@/core/constants/mockStorage";

type MockTableOptionsType<Row> = {
  tableName: string;
  rowSchema: ZodType<Row>;
  initialRows: Row[];
};

export type MockTableType<Row> = {
  readRows: () => Row[];
  writeRows: (rows: Row[]) => void;
};

const buildStorageKey = (tableName: string): string =>
  `${MOCK_STORAGE_PREFIX}v${MOCK_STORAGE_VERSION}:${tableName}`;

const readStoredValue = (storageKey: string): unknown => {
  try {
    const storedText = window.localStorage.getItem(storageKey);

    return storedText === null ? null : JSON.parse(storedText);
  } catch {
    return null;
  }
};

// The mock backend's "table": rows live in memory and are mirrored to
// localStorage, so edits survive a reload. Stored rows are validated on
// the first read; missing or broken data falls back to the initial mocks.
export const createMockTable = <Row>({
  tableName,
  rowSchema,
  initialRows,
}: MockTableOptionsType<Row>): MockTableType<Row> => {
  const storageKey = buildStorageKey(tableName);
  let cachedRows: Row[] | null = null;

  const loadRows = (): Row[] => {
    const parsedRows = rowSchema.array().safeParse(readStoredValue(storageKey));

    return parsedRows.success ? parsedRows.data : [...initialRows];
  };

  return {
    readRows: () => {
      cachedRows ??= loadRows();

      return [...cachedRows];
    },
    writeRows: (rows) => {
      cachedRows = [...rows];

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(rows));
      } catch {
        // Storage may be full or disabled (private mode); the data then
        // lives only until the page is reloaded, as before.
      }
    },
  };
};
