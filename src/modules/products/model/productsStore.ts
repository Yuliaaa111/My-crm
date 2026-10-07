import { create } from "zustand";

import { LOAD_STATUS } from "@/core/constants/loadStatus";
import type { LoadStatusType } from "@/core/types";
import type { ProductType } from "./types";

type ProductsStoreType = {
  products: ProductType[];
  loadStatus: LoadStatusType;
  loadErrorMessage: string | null;
  startLoading: () => void;
  setProducts: (products: ProductType[]) => void;
  setLoadError: (errorMessage: string) => void;
  saveProduct: (product: ProductType) => void;
  removeProduct: (productId: string) => void;
};

export const useProductsStore = create<ProductsStoreType>()((set) => ({
  products: [],
  loadStatus: LOAD_STATUS.idle,
  loadErrorMessage: null,
  startLoading: () =>
    set({ loadStatus: LOAD_STATUS.loading, loadErrorMessage: null }),
  setProducts: (products) => set({ products, loadStatus: LOAD_STATUS.success }),
  setLoadError: (loadErrorMessage) =>
    set({ loadStatus: LOAD_STATUS.error, loadErrorMessage }),
  saveProduct: (savedProduct) =>
    set(({ products }) => ({
      products: products.some(({ id }) => id === savedProduct.id)
        ? products.map((product) =>
            product.id === savedProduct.id ? savedProduct : product,
          )
        : [savedProduct, ...products],
    })),
  removeProduct: (productId) =>
    set(({ products }) => ({
      products: products.filter(({ id }) => id !== productId),
    })),
}));
