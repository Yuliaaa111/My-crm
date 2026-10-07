import { mockRequest } from "@/core/api/mockRequest";
import { createMockTable } from "@/core/api/mockTable";
import {
  buildInsufficientStockMessage,
  PRODUCT_NOT_FOUND_MESSAGE,
  PRODUCT_VALIDATION_MESSAGES,
} from "./constants";
import { MOCK_PRODUCTS } from "./mocks";
import { productRecordSchema } from "./schema";
import type {
  ProductRequest,
  ProductResponse,
  ProductsListResponse,
  ProductType,
  StockChangeType,
} from "./types";

// Stand-in for the backend table, persisted to localStorage (see
// core/api/mockTable.ts).
const productsTable = createMockTable({
  tableName: "products",
  rowSchema: productRecordSchema,
  initialRows: MOCK_PRODUCTS,
});

const findProductOrThrow = (productId: string): ProductType => {
  const product = productsTable.readRows().find(({ id }) => id === productId);

  if (!product) {
    throw new Error(PRODUCT_NOT_FOUND_MESSAGE);
  }

  return product;
};

const assertSkuIsFree = (sku: string, ownProductId?: string): void => {
  const isSkuTaken = productsTable
    .readRows()
    .some((product) => product.sku === sku && product.id !== ownProductId);

  if (isSkuTaken) {
    throw new Error(PRODUCT_VALIDATION_MESSAGES.skuTaken);
  }
};

const applyStockChanges = (
  stockChanges: StockChangeType[],
  direction: 1 | -1,
): void => {
  productsTable.writeRows(
    productsTable.readRows().map((product) => {
      const quantityChange = stockChanges
        .filter(({ productId }) => productId === product.id)
        .reduce((total, { quantity }) => total + quantity, 0);

      return quantityChange === 0
        ? product
        : { ...product, stock: product.stock + direction * quantityChange };
    }),
  );
};

// Server-side operations for the orders module. They run inside another
// mock request, so they are synchronous: the whole order either reserves
// every item or fails without changing any stock.
export const reserveProductsStock = (stockChanges: StockChangeType[]): void => {
  stockChanges.forEach(({ productId, quantity }) => {
    const product = findProductOrThrow(productId);

    if (product.stock < quantity) {
      throw new Error(
        buildInsufficientStockMessage(product.name, product.stock),
      );
    }
  });

  applyStockChanges(stockChanges, -1);
};

// Products deleted after the order was placed are skipped: there is no
// stock left to return them to.
export const releaseProductsStock = (stockChanges: StockChangeType[]): void => {
  applyStockChanges(stockChanges, 1);
};

export const fetchProducts = (): Promise<ProductsListResponse> =>
  mockRequest(() => productsTable.readRows());

export const createProduct = (
  request: ProductRequest,
): Promise<ProductResponse> =>
  mockRequest(() => {
    assertSkuIsFree(request.sku);

    const createdProduct: ProductType = {
      ...request,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    productsTable.writeRows([createdProduct, ...productsTable.readRows()]);

    return createdProduct;
  });

export const updateProduct = (
  productId: string,
  request: ProductRequest,
): Promise<ProductResponse> =>
  mockRequest(() => {
    assertSkuIsFree(request.sku, productId);

    const updatedProduct: ProductType = {
      ...findProductOrThrow(productId),
      ...request,
    };
    productsTable.writeRows(
      productsTable
        .readRows()
        .map((product) =>
          product.id === productId ? updatedProduct : product,
        ),
    );

    return updatedProduct;
  });

export const deleteProduct = (productId: string): Promise<void> =>
  mockRequest(() => {
    findProductOrThrow(productId);
    productsTable.writeRows(
      productsTable.readRows().filter(({ id }) => id !== productId),
    );
  });
