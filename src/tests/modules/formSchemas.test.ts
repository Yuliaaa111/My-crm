import { describe, expect, it } from "vitest";

import { loginSchema } from "@/modules/auth/model/schema";
import { customerSchema } from "@/modules/customers/model/schema";
import type { CustomerRequest } from "@/modules/customers/model/types";
import { orderFormSchema } from "@/modules/orders/model/schema";
import { productSchema } from "@/modules/products/model/schema";
import type { ProductRequest } from "@/modules/products/model/types";

const getMessages = (result: {
  success: boolean;
  error?: { issues: { message: string }[] };
}): string[] => result.error?.issues.map(({ message }) => message) ?? [];

const validCustomer: CustomerRequest = {
  firstName: "Иван",
  lastName: "Петров",
  email: "ivan@test.ru",
  phone: "+7 (912) 345-67-01",
  company: "",
  city: "Москва",
  countryCode: "RU",
  status: "active",
};

const validProduct: ProductRequest = {
  name: "Стул",
  sku: "FR-TST-01",
  category: "furniture",
  price: 1_500,
  stock: 5,
  status: "active",
  description: "",
};

describe("loginSchema", () => {
  it("принимает email и пароль", () => {
    expect(
      loginSchema.safeParse({ email: "demo@mycrm.test", password: "demo12345" })
        .success,
    ).toBe(true);
  });

  it("требует корректный email и непустой пароль", () => {
    expect(
      getMessages(loginSchema.safeParse({ email: "demo", password: "" })),
    ).toEqual(["Введите корректный email", "Введите пароль"]);
  });
});

describe("customerSchema", () => {
  it("принимает корректного клиента и обрезает пробелы", () => {
    const result = customerSchema.safeParse({
      ...validCustomer,
      city: "  Москва  ",
    });

    expect(result.success && result.data.city).toBe("Москва");
  });

  it.each([
    ["пустое имя", { firstName: "   " }, "Введите имя"],
    [
      "телефон из букв",
      { phone: "звоните" },
      "Введите телефон: от 7 цифр, допустимы +, пробелы, скобки и дефисы",
    ],
    [
      "страна названием, а не кодом",
      { countryCode: "Россия" },
      "Выберите страну из списка",
    ],
    [
      "несуществующий код страны",
      { countryCode: "XX" },
      "Выберите страну из списка",
    ],
  ])("отклоняет: %s", (_, override, message) => {
    expect(
      getMessages(customerSchema.safeParse({ ...validCustomer, ...override })),
    ).toContain(message);
  });
});

describe("productSchema", () => {
  it("приводит артикул к верхнему регистру", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      sku: " fr-tst-01 ",
    });

    expect(result.success && result.data.sku).toBe("FR-TST-01");
  });

  it.each([
    [
      "пустая цена (NaN из числового поля)",
      { price: Number.NaN },
      "Введите цену",
    ],
    ["отрицательная цена", { price: -1 }, "Цена не может быть отрицательной"],
    ["дробный остаток", { stock: 2.5 }, "Введите целое число"],
    [
      "артикул с кириллицей",
      { sku: "СТУЛ-1" },
      "Артикул: 3–20 символов, заглавные латинские буквы, цифры и дефис",
    ],
  ])("отклоняет: %s", (_, override, message) => {
    expect(
      getMessages(productSchema.safeParse({ ...validProduct, ...override })),
    ).toContain(message);
  });
});

describe("orderFormSchema", () => {
  const item = (productId: string, quantity = 1) => ({ productId, quantity });

  it("принимает клиента и позиции", () => {
    expect(
      orderFormSchema.safeParse({
        customerId: "customer-1",
        items: [item("product-1"), item("product-2", 3)],
        comment: "",
      }).success,
    ).toBe(true);
  });

  it.each([
    ["без клиента", { customerId: "" }, "Выберите клиента"],
    ["без позиций", { items: [] }, "Добавьте хотя бы одну позицию"],
    ["товар не выбран", { items: [item("")] }, "Выберите товар"],
    [
      "количество 0",
      { items: [item("product-1", 0)] },
      "Укажите целое количество от 1",
    ],
    [
      "один товар дважды",
      { items: [item("product-1"), item("product-1")] },
      "Каждый товар можно добавить только один раз",
    ],
  ])("отклоняет: %s", (_, override, message) => {
    expect(
      getMessages(
        orderFormSchema.safeParse({
          customerId: "customer-1",
          items: [item("product-1")],
          comment: "",
          ...override,
        }),
      ),
    ).toContain(message);
  });
});
