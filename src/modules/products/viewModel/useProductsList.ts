import { type ChangeEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ALL_FILTER_VALUE } from "@/core/constants/filters";
import { ROUTES } from "@/core/constants/routes";
import { usePagination } from "@/core/hooks/usePagination";
import { buildDetailsPath } from "@/core/utils/buildDetailsPath";
import { isOneOf } from "@/core/utils/isOneOf";
import { matchesSearchQuery } from "@/core/utils/matchesSearchQuery";
import { PRODUCT_CATEGORY_FILTERS } from "../model/constants";
import { toProductView } from "../model/mappers";
import type { ProductCategoryFilterType, ProductType } from "../model/types";
import { useProductDeletion } from "./useProductDeletion";
import { useProductsData } from "./useProductsData";

const filterProducts = (
  products: ProductType[],
  searchQuery: string,
  categoryFilter: ProductCategoryFilterType,
): ProductType[] =>
  products.filter(
    (product) =>
      (categoryFilter === ALL_FILTER_VALUE ||
        product.category === categoryFilter) &&
      matchesSearchQuery([product.name, product.sku], searchQuery),
  );

export const useProductsList = () => {
  const navigate = useNavigate();
  const { products, isLoading, loadErrorMessage, reloadProducts } =
    useProductsData();
  const deletion = useProductDeletion();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<ProductCategoryFilterType>(ALL_FILTER_VALUE);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null,
  );

  const filteredProducts = useMemo(
    () => filterProducts(products, searchQuery, categoryFilter),
    [products, searchQuery, categoryFilter],
  );
  const { page, pageCount, pageItems, setPage, resetPage } =
    usePagination(filteredProducts);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    resetPage();
  };

  const handleCategoryFilterChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFilter = event.target.value;

    if (isOneOf(selectedFilter, PRODUCT_CATEGORY_FILTERS)) {
      setCategoryFilter(selectedFilter);
      resetPage();
    }
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: ProductType) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  return {
    pageProducts: pageItems.map(toProductView),
    filteredCount: filteredProducts.length,
    totalCount: products.length,
    isLoading,
    loadErrorMessage,
    reloadProducts,
    searchQuery,
    categoryFilter,
    page,
    pageCount,
    setPage,
    isFormOpen,
    editingProduct,
    deletion,
    handleSearchChange,
    handleCategoryFilterChange,
    openCreateForm,
    openEditForm,
    closeForm: () => setIsFormOpen(false),
    openProductDetails: (product: ProductType) =>
      navigate(buildDetailsPath(ROUTES.products, product.id)),
  };
};
