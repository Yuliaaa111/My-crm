import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { getErrorMessage } from "@/core/utils/getErrorMessage";
import {
  PRODUCT_CATEGORY_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  productFormDefaultValues,
} from "../model/constants";
import { toProductRequest } from "../model/mappers";
import { createProduct, updateProduct } from "../model/productsApi";
import { useProductsStore } from "../model/productsStore";
import { productSchema } from "../model/schema";
import type { ProductRequest, ProductType } from "../model/types";

export const useProductForm = (
  editingProduct: ProductType | null,
  onSaved: () => void,
) => {
  const saveProduct = useProductsStore((state) => state.saveProduct);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductRequest>({
    resolver: zodResolver(productSchema),
    defaultValues: editingProduct
      ? toProductRequest(editingProduct)
      : productFormDefaultValues,
  });

  const submitProduct = async (request: ProductRequest): Promise<void> => {
    setSubmitErrorMessage(null);

    try {
      const savedProduct = editingProduct
        ? await updateProduct(editingProduct.id, request)
        : await createProduct(request);
      saveProduct(savedProduct);
      onSaved();
    } catch (error) {
      setSubmitErrorMessage(getErrorMessage(error));
    }
  };

  return {
    register,
    errors,
    isSubmitting,
    submitErrorMessage,
    isEditing: editingProduct !== null,
    categoryOptions: PRODUCT_CATEGORY_OPTIONS,
    statusOptions: PRODUCT_STATUS_OPTIONS,
    handleFormSubmit: handleSubmit(submitProduct),
  };
};
