import { describe, expect, it } from "vitest";

import type { ProductRequest } from "@/modules/products/model/types";
import { loadFreshApis } from "../../helpers/loadModules";

const newProduct: ProductRequest = {
  name: "Тестовый стул",
  sku: "FR-TST-01",
  category: "furniture",
  price: 1_500,
  stock: 5,
  status: "active",
  description: "",
};

const stockOf = async (
  fetchProducts: () => Promise<{ id: string; stock: number }[]>,
  productId: string,
): Promise<number | undefined> =>
  (await fetchProducts()).find(({ id }) => id === productId)?.stock;

describe("productsApi", () => {
  it("создаёт, изменяет и удаляет товар", async () => {
    const { productsApi } = await loadFreshApis();
    const created = await productsApi.createProduct(newProduct);
    await productsApi.updateProduct(created.id, {
      ...newProduct,
      price: 2_000,
    });

    expect((await productsApi.fetchProducts())[0]).toMatchObject({
      id: created.id,
      price: 2_000,
    });

    await productsApi.deleteProduct(created.id);
    expect(await productsApi.fetchProducts()).toHaveLength(20);
  });

  it("не даёт создать товар с занятым артикулом", async () => {
    const { productsApi } = await loadFreshApis();

    await expect(
      productsApi.createProduct({ ...newProduct, sku: "NB-PRO-14" }),
    ).rejects.toThrow("Товар с таким артикулом уже есть");
  });

  it("при правке позволяет оставить собственный артикул", async () => {
    const { productsApi } = await loadFreshApis();

    await expect(
      productsApi.updateProduct("product-1", {
        ...newProduct,
        sku: "NB-PRO-14",
      }),
    ).resolves.toMatchObject({ sku: "NB-PRO-14" });
  });

  it("списывает и возвращает остаток", async () => {
    const { productsApi } = await loadFreshApis();

    productsApi.reserveProductsStock([{ productId: "product-2", quantity: 5 }]);
    expect(await stockOf(productsApi.fetchProducts, "product-2")).toBe(3);

    productsApi.releaseProductsStock([{ productId: "product-2", quantity: 5 }]);
    expect(await stockOf(productsApi.fetchProducts, "product-2")).toBe(8);
  });

  it("не списывает больше остатка и не меняет другие позиции (всё или ничего)", async () => {
    const { productsApi } = await loadFreshApis();

    expect(() =>
      productsApi.reserveProductsStock([
        { productId: "product-3", quantity: 1 },
        { productId: "product-2", quantity: 9 },
      ]),
    ).toThrow(
      "Недостаточно товара «Монитор Vista 27» на складе: доступно 8 шт.",
    );
    expect(await stockOf(productsApi.fetchProducts, "product-3")).toBe(120);
    expect(await stockOf(productsApi.fetchProducts, "product-2")).toBe(8);
  });

  it("складывает количество, если товар указан несколько раз", async () => {
    const { productsApi } = await loadFreshApis();

    productsApi.reserveProductsStock([
      { productId: "product-2", quantity: 3 },
      { productId: "product-2", quantity: 2 },
    ]);

    expect(await stockOf(productsApi.fetchProducts, "product-2")).toBe(3);
  });

  it("остаток сохраняется между «перезагрузками»", async () => {
    const firstLoad = await loadFreshApis();
    firstLoad.productsApi.reserveProductsStock([
      { productId: "product-2", quantity: 8 },
    ]);

    const secondLoad = await loadFreshApis();

    expect(
      await stockOf(secondLoad.productsApi.fetchProducts, "product-2"),
    ).toBe(0);
  });
});
