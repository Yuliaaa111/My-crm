import { describe, expect, it } from "vitest";

import type { OrderRequest } from "@/modules/orders/model/types";
import { loadFreshApis } from "../../helpers/loadModules";

const buildOrderRequest = (
  items: { productId: string; quantity: number }[],
): OrderRequest => ({
  customerId: "customer-2",
  customerName: "Мария Смирнова",
  comment: "",
  items: items.map(({ productId, quantity }) => ({
    productId,
    quantity,
    productName: productId,
    sku: productId,
    unitPrice: 1_000,
  })),
});

const getStock = async (
  apis: Awaited<ReturnType<typeof loadFreshApis>>,
  productId: string,
): Promise<number | undefined> =>
  (await apis.productsApi.fetchProducts()).find(({ id }) => id === productId)
    ?.stock;

describe("ordersApi", () => {
  it("отдаёт 30 заказов из моков", async () => {
    const { ordersApi } = await loadFreshApis();

    expect(await ordersApi.fetchOrders()).toHaveLength(30);
  });

  it("создаёт заказ: следующий номер, статус «Новый», история и списание остатка", async () => {
    const apis = await loadFreshApis();
    const created = await apis.ordersApi.createOrder(
      buildOrderRequest([{ productId: "product-2", quantity: 5 }]),
    );

    expect(created).toMatchObject({ number: "ORD-1031", status: "pending" });
    expect(created.statusHistory).toEqual([
      { status: "pending", changedAt: created.createdAt },
    ]);
    expect(await getStock(apis, "product-2")).toBe(3);
  });

  it("отклоняет заказ больше остатка и ничего не создаёт", async () => {
    const apis = await loadFreshApis();

    await expect(
      apis.ordersApi.createOrder(
        buildOrderRequest([{ productId: "product-2", quantity: 9 }]),
      ),
    ).rejects.toThrow("Недостаточно товара");
    expect(await apis.ordersApi.fetchOrders()).toHaveLength(30);
    expect(await getStock(apis, "product-2")).toBe(8);
  });

  it("пропускает только разрешённые переходы статуса", async () => {
    const apis = await loadFreshApis();
    const created = await apis.ordersApi.createOrder(
      buildOrderRequest([{ productId: "product-3", quantity: 1 }]),
    );

    await expect(
      apis.ordersApi.updateOrderStatus(created.id, { status: "delivered" }),
    ).rejects.toThrow("Этот переход статуса недоступен");

    const paid = await apis.ordersApi.updateOrderStatus(created.id, {
      status: "paid",
    });
    expect(paid.status).toBe("paid");
    expect(paid.statusHistory.map(({ status }) => status)).toEqual([
      "pending",
      "paid",
    ]);
  });

  it("отмена возвращает товары на склад", async () => {
    const apis = await loadFreshApis();
    const created = await apis.ordersApi.createOrder(
      buildOrderRequest([{ productId: "product-2", quantity: 5 }]),
    );
    await apis.ordersApi.updateOrderStatus(created.id, { status: "cancelled" });

    expect(await getStock(apis, "product-2")).toBe(8);
  });

  it("удаление незакрытого заказа возвращает товары, доставленного — нет", async () => {
    const apis = await loadFreshApis();
    const created = await apis.ordersApi.createOrder(
      buildOrderRequest([{ productId: "product-3", quantity: 20 }]),
    );
    await apis.ordersApi.deleteOrder(created.id);
    expect(await getStock(apis, "product-3")).toBe(120);

    const delivered = (await apis.ordersApi.fetchOrders()).find(
      ({ status }) => status === "delivered",
    );
    const deliveredProductId = delivered?.items[0].productId ?? "";
    const stockBefore = await getStock(apis, deliveredProductId);
    await apis.ordersApi.deleteOrder(delivered?.id ?? "");

    expect(await getStock(apis, deliveredProductId)).toBe(stockBefore);
  });

  it("заказы и остатки сохраняются между «перезагрузками»", async () => {
    const firstLoad = await loadFreshApis();
    await firstLoad.ordersApi.createOrder(
      buildOrderRequest([{ productId: "product-2", quantity: 2 }]),
    );

    const secondLoad = await loadFreshApis();
    const orders = await secondLoad.ordersApi.fetchOrders();

    expect(orders).toHaveLength(31);
    expect(orders[0].number).toBe("ORD-1031");
    expect(await getStock(secondLoad, "product-2")).toBe(6);
    await expect(
      secondLoad.ordersApi.createOrder(
        buildOrderRequest([{ productId: "product-9", quantity: 1 }]),
      ),
    ).resolves.toMatchObject({ number: "ORD-1032" });
  });

  it("испорченные заказы в хранилище — откат к 30 заказам из моков", async () => {
    window.localStorage.setItem(
      "my-crm-mock:v2:orders",
      JSON.stringify([{ id: "broken" }]),
    );
    const { ordersApi } = await loadFreshApis();

    expect(await ordersApi.fetchOrders()).toHaveLength(30);
  });
});
