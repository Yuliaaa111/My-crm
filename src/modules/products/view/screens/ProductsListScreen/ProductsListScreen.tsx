import { Plus } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { Button } from "@/core/ui/Button/Button";
import { ConfirmDialog } from "@/core/ui/ConfirmDialog/ConfirmDialog";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";
import { Input } from "@/core/ui/Input/Input";
import { Loader } from "@/core/ui/Loader/Loader";
import { PageHeader } from "@/core/ui/PageHeader/PageHeader";
import { Pagination } from "@/core/ui/Pagination/Pagination";
import { Select } from "@/core/ui/Select/Select";
import { Toolbar } from "@/core/ui/Toolbar/Toolbar";
import { PRODUCT_CATEGORY_FILTER_OPTIONS } from "../../../model/constants";
import { useProductsList } from "../../../viewModel/useProductsList";
import { ProductFormModal } from "../../components/ProductFormModal/ProductFormModal";
import { ProductsTable } from "../../components/ProductsTable/ProductsTable";

export const ProductsListScreen = () => {
  const {
    pageProducts,
    filteredCount,
    totalCount,
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
    closeForm,
    openProductDetails,
  } = useProductsList();

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (loadErrorMessage) {
      return (
        <EmptyState
          title="Не удалось загрузить товары"
          description={loadErrorMessage}
          action={<Button onClick={reloadProducts}>Повторить</Button>}
        />
      );
    }

    return (
      <>
        <Toolbar>
          <Input
            type="search"
            placeholder="Поиск по названию или артикулу"
            aria-label="Поиск товаров"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select
            aria-label="Фильтр по категории"
            options={PRODUCT_CATEGORY_FILTER_OPTIONS}
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          />
        </Toolbar>
        <ProductsTable
          products={pageProducts}
          onOpen={openProductDetails}
          onEdit={openEditForm}
          onDelete={deletion.requestDeletion}
        />
        {pageCount > 1 ? (
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        ) : null}
      </>
    );
  };

  return (
    <>
      <PageHeader
        title="Товары"
        description={
          isLoading ? null : `Показано ${filteredCount} из ${totalCount}`
        }
        actions={
          <Button onClick={openCreateForm}>
            <Plus size={ICON_SIZE} />
            Добавить товар
          </Button>
        }
      />
      {renderContent()}
      {isFormOpen ? (
        <ProductFormModal editingProduct={editingProduct} onClose={closeForm} />
      ) : null}
      {deletion.productToDelete ? (
        <ConfirmDialog
          title="Удалить товар?"
          message={deletion.deletionMessage}
          confirmLabel="Удалить"
          isConfirming={deletion.isDeleting}
          errorMessage={deletion.deletionErrorMessage}
          onConfirm={deletion.confirmDeletion}
          onCancel={deletion.cancelDeletion}
        />
      ) : null}
    </>
  );
};
