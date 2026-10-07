import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import type { SelectOptionType } from "@/core/types";
import { formatCurrency } from "@/core/utils/formatCurrency";
import { getErrorMessage } from "@/core/utils/getErrorMessage";
import {
  type CustomerType,
  useCustomersData,
} from "@/modules/customers/public";
import {
  loadProducts,
  type ProductType,
  useProductsData,
} from "@/modules/products/public";
import { getOrderTotal } from "../model/calculations";
import {
  buildQuantityExceedsStockMessage,
  emptyOrderFormItem,
  orderFormDefaultValues,
} from "../model/constants";
import { createOrder } from "../model/ordersApi";
import { useOrdersStore } from "../model/ordersStore";
import { orderFormSchema } from "../model/schema";
import type {
  OrderFormItemType,
  OrderFormValuesType,
  OrderItemType,
  OrderRequest,
  OrderType,
} from "../model/types";

const ACTIVE_STATUS = "active";
const NOT_SELECTED_VALUE = "";

const buildCustomerOptions = (
  customers: CustomerType[],
): SelectOptionType[] => [
  { value: NOT_SELECTED_VALUE, label: "Выберите клиента" },
  ...customers
    .filter(({ status }) => status === ACTIVE_STATUS)
    .map(({ id, firstName, lastName, company }) => ({
      value: id,
      label: [`${firstName} ${lastName}`, company].filter(Boolean).join(" · "),
    }))
    .sort((first, second) => first.label.localeCompare(second.label)),
];

const buildProductOptions = (products: ProductType[]): SelectOptionType[] => [
  { value: NOT_SELECTED_VALUE, label: "Выберите товар" },
  ...products
    .filter(({ status, stock }) => status === ACTIVE_STATUS && stock > 0)
    .map(({ id, name, price, stock }) => ({
      value: id,
      label: `${name} — ${formatCurrency(price)} · на складе ${stock} шт.`,
    })),
];

const toOrderItems = (
  formItems: OrderFormItemType[],
  products: ProductType[],
): OrderItemType[] =>
  formItems.flatMap(({ productId, quantity }) => {
    const product = products.find(({ id }) => id === productId);

    return product
      ? [
          {
            productId,
            productName: product.name,
            sku: product.sku,
            unitPrice: product.price,
            quantity,
          },
        ]
      : [];
  });

const buildOrderRequest = (
  formValues: OrderFormValuesType,
  customer: CustomerType,
  products: ProductType[],
): OrderRequest => ({
  customerId: customer.id,
  customerName: `${customer.firstName} ${customer.lastName}`,
  items: toOrderItems(formValues.items, products),
  comment: formValues.comment,
});

export const useOrderForm = (onCreated: (order: OrderType) => void) => {
  const saveOrder = useOrdersStore((state) => state.saveOrder);
  const { customers, isLoading: isLoadingCustomers } = useCustomersData();
  const { products, isLoading: isLoadingProducts } = useProductsData();
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null,
  );
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValuesType>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: orderFormDefaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = useWatch({ control, name: "items" });

  // Quantities typed into the form may be NaN or not yet valid; they are
  // left out of the running total until they become positive numbers.
  const previewTotal = getOrderTotal({
    items: toOrderItems(
      watchedItems.filter(({ quantity }) => quantity > 0),
      products,
    ),
  });

  // The form checks stock against the cached products to point at the
  // exact position; the mock API checks again, as a server would, in case
  // the stock changed since the products were loaded.
  const markItemsExceedingStock = (formItems: OrderFormItemType[]): boolean => {
    let hasExceedingItems = false;

    formItems.forEach(({ productId, quantity }, index) => {
      const product = products.find(({ id }) => id === productId);

      if (product && quantity > product.stock) {
        hasExceedingItems = true;
        setError(`items.${index}.quantity`, {
          message: buildQuantityExceedsStockMessage(product.stock),
        });
      }
    });

    return hasExceedingItems;
  };

  const submitOrder = async (
    formValues: OrderFormValuesType,
  ): Promise<void> => {
    setSubmitErrorMessage(null);

    if (markItemsExceedingStock(formValues.items)) {
      return;
    }

    const customer = customers.find(({ id }) => id === formValues.customerId);
    const orderRequest = customer
      ? buildOrderRequest(formValues, customer, products)
      : null;

    if (
      !orderRequest ||
      orderRequest.items.length !== formValues.items.length
    ) {
      setSubmitErrorMessage(
        "Клиент или товар больше недоступен. Обновите страницу.",
      );
      return;
    }

    try {
      const createdOrder = await createOrder(orderRequest);
      saveOrder(createdOrder);
      loadProducts();
      onCreated(createdOrder);
    } catch (error) {
      setSubmitErrorMessage(getErrorMessage(error));
    }
  };

  return {
    register,
    errors,
    itemFields: fields,
    itemsErrorMessage: errors.items?.message ?? errors.items?.root?.message,
    canRemoveItems: fields.length > 1,
    addItem: () => append(emptyOrderFormItem),
    removeItem: remove,
    totalLabel: formatCurrency(previewTotal),
    customerOptions: buildCustomerOptions(customers),
    productOptions: buildProductOptions(products),
    isLoadingOptions: isLoadingCustomers || isLoadingProducts,
    isSubmitting,
    submitErrorMessage,
    handleFormSubmit: handleSubmit(submitOrder),
  };
};
