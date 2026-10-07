import { mockRequest } from "@/core/api/mockRequest";
import {
  PRODUCT_NOT_FOUND_MESSAGE,
  PRODUCT_VALIDATION_MESSAGES,
} from "./constants";
import { MOCK_PRODUCTS } from "./mocks";
import type {
  ProductRequest,
  ProductResponse,
  ProductsListResponse,
  ProductType,
} from "./types";

// In-memory stand-in for the backend table: changes live until the page
// is reloaded, like in the original demo.
let productsTable: ProductType[] = [...MOCK_PRODUCTS];

const findProductOrThrow = (productId: string): ProductType => {
  const product = productsTable.find(({ id }) => id === productId);

  if (!product) {
    throw new Error(PRODUCT_NOT_FOUND_MESSAGE);
  }

  return product;
};

const assertSkuIsFree = (sku: string, ownProductId?: string): void => {
  const isSkuTaken = productsTable.some(
    (product) => product.sku === sku && product.id !== ownProductId,
  );

  if (isSkuTaken) {
    throw new Error(PRODUCT_VALIDATION_MESSAGES.skuTaken);
  }
};

export const fetchProducts = (): Promise<ProductsListResponse> =>
  mockRequest(() => [...productsTable]);

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
    productsTable = [createdProduct, ...productsTable];

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
    productsTable = productsTable.map((product) =>
      product.id === productId ? updatedProduct : product,
    );

    return updatedProduct;
  });

export const deleteProduct = (productId: string): Promise<void> =>
  mockRequest(() => {
    findProductOrThrow(productId);
    productsTable = productsTable.filter(({ id }) => id !== productId);
  });
