import { describe, expect, it } from "vitest";

import { formatCurrency } from "@/core/utils/formatCurrency";
import { formatDate } from "@/core/utils/formatDate";
import { normalizeSpaces } from "../../helpers/text";

describe("formatCurrency", () => {
  it("форматирует рубли без копеек с разделением разрядов", () => {
    expect(normalizeSpaces(formatCurrency(89_990))).toBe("89 990 ₽");
    expect(normalizeSpaces(formatCurrency(1_458_990))).toBe("1 458 990 ₽");
    expect(normalizeSpaces(formatCurrency(0))).toBe("0 ₽");
  });

  it("округляет дробные суммы", () => {
    expect(normalizeSpaces(formatCurrency(1_499.6))).toBe("1 500 ₽");
  });
});

describe("formatDate", () => {
  it("показывает дату в формате ДД.ММ.ГГГГ", () => {
    expect(formatDate("2026-01-12T09:30:00.000Z")).toBe("12.01.2026");
  });
});
