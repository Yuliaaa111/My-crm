import { ALL_FILTER_VALUE } from "@/core/constants/filters";
import type { BadgeToneType, SelectOptionType } from "@/core/types";
import type {
  ProductCategoryFilterType,
  ProductCategoryType,
  ProductRequest,
  ProductStatusType,
  ProductStockLevelType,
} from "./types";

export const LOW_STOCK_THRESHOLD = 10;

export const PRODUCT_STATUSES: ProductStatusType[] = ["active", "archived"];

export const PRODUCT_CATEGORIES: ProductCategoryType[] = [
  "electronics",
  "office",
  "furniture",
  "software",
  "accessories",
];

export const PRODUCT_CATEGORY_FILTERS: ProductCategoryFilterType[] = [
  ALL_FILTER_VALUE,
  ...PRODUCT_CATEGORIES,
];

export const PRODUCT_STATUS_LABELS: Record<ProductStatusType, string> = {
  active: "В продаже",
  archived: "В архиве",
};

export const PRODUCT_STATUS_TONES: Record<ProductStatusType, BadgeToneType> = {
  active: "success",
  archived: "neutral",
};

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategoryType, string> = {
  electronics: "Электроника",
  office: "Канцелярия",
  furniture: "Мебель",
  software: "Программы",
  accessories: "Аксессуары",
};

export const PRODUCT_STOCK_LEVEL_LABELS: Record<ProductStockLevelType, string> =
  {
    inStock: "В наличии",
    lowStock: "Мало на складе",
    outOfStock: "Нет в наличии",
  };

export const PRODUCT_STOCK_LEVEL_TONES: Record<
  ProductStockLevelType,
  BadgeToneType
> = {
  inStock: "success",
  lowStock: "warning",
  outOfStock: "danger",
};

export const PRODUCT_STATUS_OPTIONS: SelectOptionType[] = PRODUCT_STATUSES.map(
  (status) => ({ value: status, label: PRODUCT_STATUS_LABELS[status] }),
);

export const PRODUCT_CATEGORY_OPTIONS: SelectOptionType[] =
  PRODUCT_CATEGORIES.map((category) => ({
    value: category,
    label: PRODUCT_CATEGORY_LABELS[category],
  }));

export const PRODUCT_CATEGORY_FILTER_OPTIONS: SelectOptionType[] = [
  { value: ALL_FILTER_VALUE, label: "Все категории" },
  ...PRODUCT_CATEGORY_OPTIONS,
];

export const PRODUCT_NOT_FOUND_MESSAGE = "Товар не найден";
export const SKU_PATTERN = /^[A-Z0-9-]{3,20}$/;
export const MAX_DESCRIPTION_LENGTH = 500;

export const PRODUCT_VALIDATION_MESSAGES = {
  name: "Введите название",
  sku: "Артикул: 3–20 символов, заглавные латинские буквы, цифры и дефис",
  skuTaken: "Товар с таким артикулом уже есть",
  price: "Введите цену",
  priceMin: "Цена не может быть отрицательной",
  stock: "Введите целое число",
  stockMin: "Остаток не может быть отрицательным",
  description: `Описание — не длиннее ${MAX_DESCRIPTION_LENGTH} символов`,
};

export const productFormDefaultValues: ProductRequest = {
  name: "",
  sku: "",
  category: "electronics",
  price: 0,
  stock: 0,
  status: "active",
  description: "",
};
