import { css } from "@emotion/css";
import { Plus, X } from "lucide-react";

import { ICON_SIZE } from "@/core/constants/layout";
import { Button } from "@/core/ui/Button/Button";
import { FormField } from "@/core/ui/FormField/FormField";
import { IconButton } from "@/core/ui/IconButton/IconButton";
import { Input } from "@/core/ui/Input/Input";
import { Loader } from "@/core/ui/Loader/Loader";
import { Modal } from "@/core/ui/Modal/Modal";
import { Select } from "@/core/ui/Select/Select";
import { Textarea } from "@/core/ui/Textarea/Textarea";
import type { OrderType } from "../../../model/types";
import { useOrderForm } from "../../../viewModel/useOrderForm";

import { useStyles } from "./OrderFormModal.styles";

type OrderFormModalProps = {
  onClose: () => void;
  onCreated: (order: OrderType) => void;
};

export const OrderFormModal = ({ onClose, onCreated }: OrderFormModalProps) => {
  const styles = useStyles();
  const {
    register,
    errors,
    itemFields,
    itemsErrorMessage,
    canRemoveItems,
    addItem,
    removeItem,
    totalLabel,
    customerOptions,
    productOptions,
    isLoadingOptions,
    isSubmitting,
    submitErrorMessage,
    handleFormSubmit,
  } = useOrderForm(onCreated);

  return (
    <Modal title="Новый заказ" onClose={onClose}>
      {isLoadingOptions ? (
        <Loader label="Загружаем клиентов и товары…" />
      ) : (
        <form
          className={css(styles.form)}
          onSubmit={handleFormSubmit}
          noValidate
        >
          <FormField
            label="Клиент"
            fieldId="order-customer"
            errorMessage={errors.customerId?.message}
          >
            <Select
              id="order-customer"
              options={customerOptions}
              hasError={Boolean(errors.customerId)}
              {...register("customerId")}
            />
          </FormField>
          <div>
            <h3 className={css(styles.sectionTitle)}>Позиции</h3>
            <div className={css(styles.items)}>
              {itemFields.map((itemField, index) => (
                <div key={itemField.id} className={css(styles.itemRow)}>
                  <FormField
                    label={`Товар ${index + 1}`}
                    fieldId={`order-item-product-${index}`}
                    errorMessage={errors.items?.[index]?.productId?.message}
                  >
                    <Select
                      id={`order-item-product-${index}`}
                      options={productOptions}
                      hasError={Boolean(errors.items?.[index]?.productId)}
                      {...register(`items.${index}.productId`)}
                    />
                  </FormField>
                  <FormField
                    label="Кол-во"
                    fieldId={`order-item-quantity-${index}`}
                    errorMessage={errors.items?.[index]?.quantity?.message}
                  >
                    <Input
                      id={`order-item-quantity-${index}`}
                      type="number"
                      min={1}
                      step={1}
                      hasError={Boolean(errors.items?.[index]?.quantity)}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </FormField>
                  <IconButton
                    label={`Убрать позицию ${index + 1}`}
                    onClick={() => removeItem(index)}
                    isDisabled={!canRemoveItems}
                  >
                    <X size={ICON_SIZE} />
                  </IconButton>
                </div>
              ))}
              {itemsErrorMessage ? (
                <p className={css(styles.itemsError)} role="alert">
                  {itemsErrorMessage}
                </p>
              ) : null}
              <div className={css(styles.addItem)}>
                <Button variant="secondary" onClick={addItem}>
                  <Plus size={ICON_SIZE} />
                  Добавить позицию
                </Button>
              </div>
            </div>
          </div>
          <FormField
            label="Комментарий (необязательно)"
            fieldId="order-comment"
            errorMessage={errors.comment?.message}
          >
            <Textarea
              id="order-comment"
              hasError={Boolean(errors.comment)}
              {...register("comment")}
            />
          </FormField>
          <div className={css(styles.total)}>
            <span>Итого</span>
            <span>{totalLabel}</span>
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
              {isSubmitting ? "Создаём…" : "Создать заказ"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
