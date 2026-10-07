import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createMockTable } from "@/core/api/mockTable";
import { MOCK_STORAGE_VERSION } from "@/core/constants/mockStorage";

type RowType = { id: string; title: string };

const rowSchema: z.ZodType<RowType> = z.object({
  id: z.string(),
  title: z.string(),
});
const initialRows: RowType[] = [{ id: "1", title: "Исходная запись" }];
const storageKey = `my-crm-mock:v${MOCK_STORAGE_VERSION}:test`;

const createTable = () =>
  createMockTable({ tableName: "test", rowSchema, initialRows });

describe("createMockTable", () => {
  it("без сохранённых данных отдаёт исходные моки", () => {
    expect(createTable().readRows()).toEqual(initialRows);
  });

  it("сохраняет записи в localStorage под ключом с версией", () => {
    const rows = [{ id: "2", title: "Новая" }];
    createTable().writeRows(rows);

    expect(
      JSON.parse(window.localStorage.getItem(storageKey) ?? "null"),
    ).toEqual(rows);
  });

  it("после «перезагрузки» читает сохранённые записи", () => {
    createTable().writeRows([{ id: "2", title: "Новая" }]);

    expect(createTable().readRows()).toEqual([{ id: "2", title: "Новая" }]);
  });

  it("откатывается к мокам, если в хранилище не JSON", () => {
    window.localStorage.setItem(storageKey, "{ не JSON");

    expect(createTable().readRows()).toEqual(initialRows);
  });

  it("откатывается к мокам, если записи не проходят схему", () => {
    window.localStorage.setItem(storageKey, JSON.stringify([{ id: 1 }]));

    expect(createTable().readRows()).toEqual(initialRows);
  });

  it("игнорирует данные под ключом другой версии", () => {
    window.localStorage.setItem(
      `my-crm-mock:v${MOCK_STORAGE_VERSION - 1}:test`,
      JSON.stringify([{ id: "old", title: "Старый формат" }]),
    );

    expect(createTable().readRows()).toEqual(initialRows);
  });

  it("отдаёт копию: изменение результата не меняет таблицу", () => {
    const table = createTable();
    table.readRows().push({ id: "x", title: "Мусор" });

    expect(table.readRows()).toEqual(initialRows);
  });

  it("продолжает работать в памяти, если хранилище недоступно", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    const table = createTable();

    expect(() =>
      table.writeRows([{ id: "3", title: "Только в памяти" }]),
    ).not.toThrow();
    expect(table.readRows()).toEqual([{ id: "3", title: "Только в памяти" }]);
  });
});
