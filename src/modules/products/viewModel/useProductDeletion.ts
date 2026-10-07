import { useConfirmedDeletion } from "@/core/hooks/useConfirmedDeletion";
import { deleteProduct } from "../model/productsApi";
import { useProductsStore } from "../model/productsStore";
import type { ProductType } from "../model/types";

export const useProductDeletion = (onDeleted?: () => void) => {
  const removeProduct = useProductsStore((state) => state.removeProduct);
  const { itemToDelete, ...deletion } = useConfirmedDeletion(
    async (product: ProductType) => {
      await deleteProduct(product.id);
      removeProduct(product.id);
      onDeleted?.();
    },
  );

  return {
    ...deletion,
    productToDelete: itemToDelete,
    deletionMessage: itemToDelete
      ? `Товар «${itemToDelete.name}» будет удалён без возможности восстановления.`
      : "",
  };
};
