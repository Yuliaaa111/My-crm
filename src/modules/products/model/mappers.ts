import { formatCurrency } from "@/core/utils/formatCurrency";
import { formatDate } from "@/core/utils/formatDate";
import { LOW_STOCK_THRESHOLD, PRODUCT_CATEGORY_LABELS } from "./constants";
import type {
  ProductRequest,
  ProductStockLevelType,
  ProductType,
  ProductViewType,
} from "./types";

export const getStockLevel = (stock: number): ProductStockLevelType => {
  if (stock === 0) {
    return "outOfStock";
  }

  return stock < LOW_STOCK_THRESHOLD ? "lowStock" : "inStock";
};

export const toProductView = (product: ProductType): ProductViewType => ({
  ...product,
  categoryLabel: PRODUCT_CATEGORY_LABELS[product.category],
  priceLabel: formatCurrency(product.price),
  stockLevel: getStockLevel(product.stock),
  createdAtLabel: formatDate(product.createdAt),
});

export const toProductRequest = ({
  name,
  sku,
  category,
  price,
  stock,
  status,
  description,
}: ProductType): ProductRequest => ({
  name,
  sku,
  category,
  price,
  stock,
  status,
  description,
});
