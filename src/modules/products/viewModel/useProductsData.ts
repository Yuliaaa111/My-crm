import { useEffect } from "react";

import { LOAD_STATUS } from "@/core/constants/loadStatus";
import { getErrorMessage } from "@/core/utils/getErrorMessage";
import { fetchProducts } from "../model/productsApi";
import { useProductsStore } from "../model/productsStore";

const loadProducts = async (): Promise<void> => {
  const { startLoading, setProducts, setLoadError } =
    useProductsStore.getState();

  startLoading();

  try {
    setProducts(await fetchProducts());
  } catch (error) {
    setLoadError(getErrorMessage(error));
  }
};

export const useProductsData = () => {
  const products = useProductsStore((state) => state.products);
  const loadStatus = useProductsStore((state) => state.loadStatus);
  const loadErrorMessage = useProductsStore((state) => state.loadErrorMessage);

  useEffect(() => {
    // Read the status at call time: several screens may mount at once,
    // and only the first of them should start the request.
    if (useProductsStore.getState().loadStatus === LOAD_STATUS.idle) {
      loadProducts();
    }
  }, []);

  return {
    products,
    isLoading:
      loadStatus === LOAD_STATUS.idle || loadStatus === LOAD_STATUS.loading,
    loadErrorMessage,
    reloadProducts: loadProducts,
  };
};
