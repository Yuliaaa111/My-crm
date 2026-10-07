export type ProductStatusType = "active" | "archived";

export type ProductCategoryType =
  "electronics" | "office" | "furniture" | "software" | "accessories";

export type ProductCategoryFilterType = ProductCategoryType | "all";

export type ProductStockLevelType = "inStock" | "lowStock" | "outOfStock";

export type ProductType = {
  id: string;
  name: string;
  sku: string;
  category: ProductCategoryType;
  price: number;
  stock: number;
  status: ProductStatusType;
  description: string;
  createdAt: string;
};

export type ProductViewType = ProductType & {
  categoryLabel: string;
  priceLabel: string;
  stockLevel: ProductStockLevelType;
  createdAtLabel: string;
};

export type ProductRequest = Omit<ProductType, "id" | "createdAt">;

export type ProductResponse = ProductType;

export type ProductsListResponse = ProductType[];
