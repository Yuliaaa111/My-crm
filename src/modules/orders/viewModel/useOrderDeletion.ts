import { useConfirmedDeletion } from "@/core/hooks/useConfirmedDeletion";
import { loadProducts } from "@/modules/products/public";
import { deleteOrder } from "../model/ordersApi";
import { useOrdersStore } from "../model/ordersStore";
import type { OrderType } from "../model/types";

export const useOrderDeletion = (onDeleted?: () => void) => {
  const removeOrder = useOrdersStore((state) => state.removeOrder);
  const { itemToDelete, ...deletion } = useConfirmedDeletion(
    async (order: OrderType) => {
      await deleteOrder(order.id);
      removeOrder(order.id);
      loadProducts();
      onDeleted?.();
    },
  );

  return {
    ...deletion,
    orderToDelete: itemToDelete,
    deletionMessage: itemToDelete
      ? `Заказ ${itemToDelete.number} будет удалён без возможности восстановления.`
      : "",
  };
};
