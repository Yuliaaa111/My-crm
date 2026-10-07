import { css } from "@emotion/css";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { Button } from "@/core/ui/Button/Button";
import { Card } from "@/core/ui/Card/Card";
import { ConfirmDialog } from "@/core/ui/ConfirmDialog/ConfirmDialog";
import { DescriptionList } from "@/core/ui/DescriptionList/DescriptionList";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";
import { IconButton } from "@/core/ui/IconButton/IconButton";
import { Loader } from "@/core/ui/Loader/Loader";
import { PageHeader } from "@/core/ui/PageHeader/PageHeader";
import { PRODUCT_NOT_FOUND_MESSAGE } from "../../../model/constants";
import { useProductDetails } from "../../../viewModel/useProductDetails";
import { ProductFormModal } from "../../components/ProductFormModal/ProductFormModal";
import { ProductStatusBadge } from "../../components/ProductStatusBadge/ProductStatusBadge";
import { StockLevelBadge } from "../../components/StockLevelBadge/StockLevelBadge";

import { useStyles } from "./ProductDetailsScreen.styles";

export const ProductDetailsScreen = () => {
  const styles = useStyles();
  const {
    product,
    isLoading,
    loadErrorMessage,
    reloadProducts,
    deletion,
    isFormOpen,
    openEditForm,
    closeForm,
    goToProductsList,
  } = useProductDetails();

  if (isLoading) {
    return <Loader />;
  }

  if (loadErrorMessage) {
    return (
      <EmptyState
        title="Не удалось загрузить товар"
        description={loadErrorMessage}
        action={<Button onClick={reloadProducts}>Повторить</Button>}
      />
    );
  }

  if (!product) {
    return (
      <EmptyState
        title={PRODUCT_NOT_FOUND_MESSAGE}
        description="Возможно, товар был удалён или ссылка неверна."
        action={<Button onClick={goToProductsList}>К списку товаров</Button>}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={product.name}
        description={
          <div className={css(styles.headerBadges)}>
            <ProductStatusBadge status={product.status} />
            <StockLevelBadge stockLevel={product.stockLevel} />
          </div>
        }
        leading={
          <IconButton label="К списку товаров" onClick={goToProductsList}>
            <ArrowLeft size={ICON_SIZE} />
          </IconButton>
        }
        actions={
          <>
            <Button variant="secondary" onClick={openEditForm}>
              <Pencil size={ICON_SIZE} />
              Редактировать
            </Button>
            <Button
              variant="danger"
              onClick={() => deletion.requestDeletion(product)}
            >
              <Trash2 size={ICON_SIZE} />
              Удалить
            </Button>
          </>
        }
      />
      <div className={css(styles.sections)}>
        <Card>
          <DescriptionList
            items={[
              { label: "Артикул", value: product.sku },
              { label: "Категория", value: product.categoryLabel },
              { label: "Цена", value: product.priceLabel },
              { label: "Остаток", value: `${product.stock} шт.` },
              { label: "Добавлен", value: product.createdAtLabel },
            ]}
          />
        </Card>
        {product.description ? (
          <Card>
            <h2 className={css(styles.sectionTitle)}>Описание</h2>
            <p className={css(styles.description)}>{product.description}</p>
          </Card>
        ) : null}
      </div>
      {isFormOpen ? (
        <ProductFormModal editingProduct={product} onClose={closeForm} />
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
