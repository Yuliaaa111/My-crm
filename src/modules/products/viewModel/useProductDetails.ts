import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { toProductView } from "../model/mappers";
import { useProductDeletion } from "./useProductDeletion";
import { useProductsData } from "./useProductsData";

export const useProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { products, isLoading, loadErrorMessage, reloadProducts } =
    useProductsData();
  const deletion = useProductDeletion(() =>
    navigate(ROUTES.products, { replace: true }),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const product = products.find(({ id }) => id === productId);

  return {
    product: product ? toProductView(product) : null,
    isLoading,
    loadErrorMessage,
    reloadProducts,
    deletion,
    isFormOpen,
    openEditForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    goToProductsList: () => navigate(ROUTES.products),
  };
};
