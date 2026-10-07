import { describe, expect, it } from "vitest";

import { isOneOf } from "@/core/utils/isOneOf";
import { matchesSearchQuery } from "@/core/utils/matchesSearchQuery";

describe("matchesSearchQuery", () => {
  const values = ["Иван Петров", "ivan.petrov@severstroy.ru", "СеверСтрой"];

  it("ищет подстроку без учёта регистра", () => {
    expect(matchesSearchQuery(values, "ПЕТРОВ")).toBe(true);
    expect(matchesSearchQuery(values, "северс")).toBe(true);
  });

  it("находит совпадение в любом из значений", () => {
    expect(matchesSearchQuery(values, "severstroy")).toBe(true);
  });

  it("пустой запрос и пробелы подходят всем", () => {
    expect(matchesSearchQuery(values, "")).toBe(true);
    expect(matchesSearchQuery(values, "   ")).toBe(true);
  });

  it("обрезает пробелы вокруг запроса", () => {
    expect(matchesSearchQuery(values, "  иван  ")).toBe(true);
  });

  it("возвращает false, если совпадений нет", () => {
    expect(matchesSearchQuery(values, "Сидоров")).toBe(false);
  });
});

describe("isOneOf", () => {
  const statuses = ["active", "inactive"];

  it("принимает значение из списка", () => {
    expect(isOneOf("active", statuses)).toBe(true);
  });

  it("отклоняет значение не из списка, в том числе другой регистр", () => {
    expect(isOneOf("archived", statuses)).toBe(false);
    expect(isOneOf("Active", statuses)).toBe(false);
  });
});
