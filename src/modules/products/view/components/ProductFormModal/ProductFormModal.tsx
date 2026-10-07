import { css } from "@emotion/css";

import { Button } from "@/core/ui/Button/Button";
import { FormField } from "@/core/ui/FormField/FormField";
import { Input } from "@/core/ui/Input/Input";
import { Modal } from "@/core/ui/Modal/Modal";
import { Select } from "@/core/ui/Select/Select";
import { Textarea } from "@/core/ui/Textarea/Textarea";
import type { ProductType } from "../../../model/types";
import { useProductForm } from "../../../viewModel/useProductForm";

import { useStyles } from "./ProductFormModal.styles";

type ProductFormModalProps = {
  editingProduct: ProductType | null;
  onClose: () => void;
};

export const ProductFormModal = ({
  editingProduct,
  onClose,
}: ProductFormModalProps) => {
  const styles = useStyles();
  const {
    register,
    errors,
    isSubmitting,
    submitErrorMessage,
    isEditing,
    categoryOptions,
    statusOptions,
    handleFormSubmit,
  } = useProductForm(editingProduct, onClose);

  return (
    <Modal
      title={isEditing ? "Редактирование товара" : "Новый товар"}
      onClose={onClose}
    >
      <form onSubmit={handleFormSubmit} noValidate>
        <div className={css(styles.fields)}>
          <div className={css(styles.wideField)}>
            <FormField
              label="Название"
              fieldId="product-name"
              errorMessage={errors.name?.message}
            >
              <Input
                id="product-name"
                autoFocus
                hasError={Boolean(errors.name)}
                {...register("name")}
              />
            </FormField>
          </div>
          <FormField
            label="Артикул"
            fieldId="product-sku"
            errorMessage={errors.sku?.message}
          >
            <Input
              id="product-sku"
              placeholder="NB-PRO-14"
              hasError={Boolean(errors.sku)}
              {...register("sku")}
            />
          </FormField>
          <FormField
            label="Категория"
            fieldId="product-category"
            errorMessage={errors.category?.message}
          >
            <Select
              id="product-category"
              options={categoryOptions}
              hasError={Boolean(errors.category)}
              {...register("category")}
            />
          </FormField>
          <FormField
            label="Цена, ₽"
            fieldId="product-price"
            errorMessage={errors.price?.message}
          >
            <Input
              id="product-price"
              type="number"
              min={0}
              step="any"
              hasError={Boolean(errors.price)}
              {...register("price", { valueAsNumber: true })}
            />
          </FormField>
          <FormField
            label="Остаток, шт."
            fieldId="product-stock"
            errorMessage={errors.stock?.message}
          >
            <Input
              id="product-stock"
              type="number"
              min={0}
              step={1}
              hasError={Boolean(errors.stock)}
              {...register("stock", { valueAsNumber: true })}
            />
          </FormField>
          <FormField
            label="Статус"
            fieldId="product-status"
            errorMessage={errors.status?.message}
          >
            <Select
              id="product-status"
              options={statusOptions}
              hasError={Boolean(errors.status)}
              {...register("status")}
            />
          </FormField>
          <div className={css(styles.wideField)}>
            <FormField
              label="Описание (необязательно)"
              fieldId="product-description"
              errorMessage={errors.description?.message}
            >
              <Textarea
                id="product-description"
                hasError={Boolean(errors.description)}
                {...register("description")}
              />
            </FormField>
          </div>
        </div>
        {submitErrorMessage ? (
          <p className={css(styles.submitError)} role="alert">
            {submitErrorMessage}
          </p>
        ) : null}
        <div className={css(styles.actions)}>
          <Button
            variant="secondary"
            onClick={onClose}
            isDisabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button type="submit" isDisabled={isSubmitting}>
            {isSubmitting ? "Сохраняем…" : "Сохранить"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
