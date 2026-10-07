import { describe, expect, it } from "vitest";

import type { CustomerType } from "@/modules/customers/public";
import {
  calculateRevenue,
  calculateRevenueByCategory,
  countActiveCustomers,
  countLowStockProducts,
  countOrdersByMonth,
  countOrdersByStatus,
  getRecentOrders,
} from "@/modules/dashboard/model/calculations";
import type { OrderStatusType, OrderType } from "@/modules/orders/public";
import type { ProductType } from "@/modules/products/public";

const buildOrder = (
  id: string,
  status: OrderStatusType,
  createdAt: string,
  items: { productId: string; unitPrice: number; quantity: number }[],
): OrderType => ({
  id,
  number: `ORD-${id}`,
  customerId: "customer-1",
  customerName: "Иван Петров",
  status,
  createdAt,
  comment: "",
  items: items.map((item) => ({ ...item, productName: "", sku: "" })),
  statusHistory: [],
});

const buildProduct = (
  id: string,
  category: ProductType["category"],
  stock: number,
  status: ProductType["status"] = "active",
): ProductType => ({
  id,
  name: id,
  sku: id,
  category,
  price: 100,
  stock,
  status,
  description: "",
  createdAt: "2026-01-01T00:00:00.000Z",
});

const orders: OrderType[] = [
  buildOrder("1", "delivered", "2026-01-10T10:00:00.000Z", [
    { productId: "laptop", unitPrice: 1_000, quantity: 2 },
  ]),
  buildOrder("2", "cancelled", "2026-01-20T10:00:00.000Z", [
    { productId: "laptop", unitPrice: 1_000, quantity: 5 },
  ]),
  buildOrder("3", "pending", "2026-03-05T10:00:00.000Z", [
    { productId: "chair", unitPrice: 300, quantity: 1 },
    { productId: "deleted", unitPrice: 50, quantity: 2 },
  ]),
];

const products: ProductType[] = [
  buildProduct("laptop", "electronics", 24),
  buildProduct("chair", "furniture", 6),
  buildProduct("desk", "furniture", 0),
  buildProduct("old", "office", 0, "archived"),
];

describe("расчёты сводки", () => {
  it("выручка — по всем заказам, кроме отменённых", () => {
    expect(calculateRevenue(orders)).toBe(2_000 + 300 + 100);
  });

  it("считает заказы по каждому статусу, включая нулевые", () => {
    const counts = countOrdersByStatus(orders);

    expect(counts).toHaveLength(6);
    expect(counts.find(({ key }) => key === "delivered")).toMatchObject({
      label: "Доставлен",
      value: 1,
    });
    expect(counts.find(({ key }) => key === "shipped")?.value).toBe(0);
  });

  it("заказы по месяцам: месяц без заказов показан нулём", () => {
    const months = countOrdersByMonth(orders);

    expect(months.map(({ key, value }) => [key, value])).toEqual([
      ["2026-01", 2],
      ["2026-02", 0],
      ["2026-03", 1],
    ]);
    expect(months[0].label).toMatch(/^янв/);
  });

  it("без заказов — пустой список месяцев", () => {
    expect(countOrdersByMonth([])).toEqual([]);
  });

  it("выручка по категориям: без отменённых, удалённые товары отдельно, по убыванию", () => {
    expect(calculateRevenueByCategory(orders, products)).toEqual([
      { key: "Электроника", label: "Электроника", value: 2_000 },
      { key: "Мебель", label: "Мебель", value: 300 },
      { key: "Удалённые товары", label: "Удалённые товары", value: 100 },
    ]);
  });

  it("малый остаток — активные товары с «мало» или «нет в наличии»", () => {
    expect(countLowStockProducts(products)).toBe(2);
  });

  it("активные клиенты", () => {
    const customers: Pick<CustomerType, "status">[] = [
      { status: "active" },
      { status: "inactive" },
      { status: "active" },
    ];

    expect(
      countActiveCustomers(
        customers.map((customer, index) => ({
          id: String(index),
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          city: "",
          countryCode: "RU",
          createdAt: "",
          ...customer,
        })),
      ),
    ).toBe(2);
  });

  it("последние заказы — самые новые сверху, не больше лимита", () => {
    expect(getRecentOrders(orders, 2).map(({ id }) => id)).toEqual(["3", "2"]);
  });
});
