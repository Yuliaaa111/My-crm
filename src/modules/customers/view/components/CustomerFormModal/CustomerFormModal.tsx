import { css } from "@emotion/css";

import { Button } from "@/core/ui/Button/Button";
import { FormField } from "@/core/ui/FormField/FormField";
import { Input } from "@/core/ui/Input/Input";
import { Modal } from "@/core/ui/Modal/Modal";
import { Select } from "@/core/ui/Select/Select";
import type { CustomerType } from "../../../model/types";
import { useCustomerForm } from "../../../viewModel/useCustomerForm";

import { useStyles } from "./CustomerFormModal.styles";

type CustomerFormModalProps = {
  editingCustomer: CustomerType | null;
  onClose: () => void;
};

export const CustomerFormModal = ({
  editingCustomer,
  onClose,
}: CustomerFormModalProps) => {
  const styles = useStyles();
  const {
    register,
    errors,
    isSubmitting,
    submitErrorMessage,
    isEditing,
    statusOptions,
    handleFormSubmit,
  } = useCustomerForm(editingCustomer, onClose);

  return (
    <Modal
      title={isEditing ? "Редактирование клиента" : "Новый клиент"}
      onClose={onClose}
    >
      <form onSubmit={handleFormSubmit} noValidate>
        <div className={css(styles.fields)}>
          <FormField
            label="Имя"
            fieldId="customer-first-name"
            errorMessage={errors.firstName?.message}
          >
            <Input
              id="customer-first-name"
              autoFocus
              hasError={Boolean(errors.firstName)}
              {...register("firstName")}
            />
          </FormField>
          <FormField
            label="Фамилия"
            fieldId="customer-last-name"
            errorMessage={errors.lastName?.message}
          >
            <Input
              id="customer-last-name"
              hasError={Boolean(errors.lastName)}
              {...register("lastName")}
            />
          </FormField>
          <FormField
            label="Email"
            fieldId="customer-email"
            errorMessage={errors.email?.message}
          >
            <Input
              id="customer-email"
              type="email"
              hasError={Boolean(errors.email)}
              {...register("email")}
            />
          </FormField>
          <FormField
            label="Телефон"
            fieldId="customer-phone"
            errorMessage={errors.phone?.message}
          >
            <Input
              id="customer-phone"
              type="tel"
              placeholder="+7 900 000-00-00"
              hasError={Boolean(errors.phone)}
              {...register("phone")}
            />
          </FormField>
          <FormField
            label="Компания (необязательно)"
            fieldId="customer-company"
            errorMessage={errors.company?.message}
          >
            <Input
              id="customer-company"
              hasError={Boolean(errors.company)}
              {...register("company")}
            />
          </FormField>
          <FormField
            label="Статус"
            fieldId="customer-status"
            errorMessage={errors.status?.message}
          >
            <Select
              id="customer-status"
              options={statusOptions}
              hasError={Boolean(errors.status)}
              {...register("status")}
            />
          </FormField>
          <FormField
            label="Город"
            fieldId="customer-city"
            errorMessage={errors.city?.message}
          >
            <Input
              id="customer-city"
              hasError={Boolean(errors.city)}
              {...register("city")}
            />
          </FormField>
          <FormField
            label="Страна"
            fieldId="customer-country"
            errorMessage={errors.country?.message}
          >
            <Input
              id="customer-country"
              hasError={Boolean(errors.country)}
              {...register("country")}
            />
          </FormField>
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
