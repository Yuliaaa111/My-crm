import { describe, expect, it } from "vitest";

import { pluralize } from "@/core/utils/pluralize";

const ORDER_FORMS = { one: "заказ", few: "заказа", many: "заказов" };

describe("pluralize", () => {
  it.each([
    [1, "заказ"],
    [21, "заказ"],
    [2, "заказа"],
    [4, "заказа"],
    [22, "заказа"],
    [0, "заказов"],
    [5, "заказов"],
    [11, "заказов"],
    [12, "заказов"],
    [25, "заказов"],
  ])("%i → %s", (count, expected) => {
    expect(pluralize(count, ORDER_FORMS)).toBe(expected);
  });
});
