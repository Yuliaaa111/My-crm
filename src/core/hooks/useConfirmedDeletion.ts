import { useState } from "react";

import { getErrorMessage } from "@/core/utils/getErrorMessage";

export const useConfirmedDeletion = <Item>(
  deleteItem: (item: Item) => Promise<void>,
) => {
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionErrorMessage, setDeletionErrorMessage] = useState<
    string | null
  >(null);

  const requestDeletion = (item: Item) => {
    setDeletionErrorMessage(null);
    setItemToDelete(item);
  };

  const cancelDeletion = () => setItemToDelete(null);

  const confirmDeletion = async (): Promise<void> => {
    if (itemToDelete === null) {
      return;
    }

    setIsDeleting(true);
    setDeletionErrorMessage(null);

    try {
      await deleteItem(itemToDelete);
      setItemToDelete(null);
    } catch (error) {
      setDeletionErrorMessage(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    itemToDelete,
    isDeleting,
    deletionErrorMessage,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  };
};
