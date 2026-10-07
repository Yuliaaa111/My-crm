import { ALL_FILTER_VALUE } from "@/core/constants/filters";
import type { BadgeToneType, SelectOptionType } from "@/core/types";
import type { PluralFormsType } from "@/core/utils/pluralize";
import type {
  OrderFormItemType,
  OrderFormValuesType,
  OrderStatusFilterType,
  OrderStatusType,
} from "./types";

export const ORDER_STATUSES: OrderStatusType[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_FILTERS: OrderStatusFilterType[] = [
  ALL_FILTER_VALUE,
  ...ORDER_STATUSES,
];

export const ORDER_STATUS_LABELS: Record<OrderStatusType, string> = {
  pending: "Новый",
  paid: "Оплачен",
  processing: "В работе",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export const ORDER_STATUS_TONES: Record<OrderStatusType, BadgeToneType> = {
  pending: "warning",
  paid: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

// Orders move forward one step at a time; a delivered or cancelled order
// is final, which replaces the payment and shipping pipeline of the
// original demo.
export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatusType,
  OrderStatusType[]
> = {
  pending: ["paid", "cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const ORDER_STATUS_ACTION_LABELS: Record<OrderStatusType, string> = {
  pending: "Вернуть в новые",
  paid: "Отметить оплату",
  processing: "Взять в работу",
  shipped: "Отметить отправку",
  delivered: "Отметить доставку",
  cancelled: "Отменить заказ",
};

export const ORDER_STATUS_FILTER_OPTIONS: SelectOptionType[] = [
  { value: ALL_FILTER_VALUE, label: "Все статусы" },
  ...ORDER_STATUSES.map((status) => ({
    value: status,
    label: ORDER_STATUS_LABELS[status],
  })),
];

// Goods of these orders are still in the warehouse, so deleting such an
// order returns them to stock; shipped and delivered goods have left.
export const STOCK_HOLDING_STATUSES: OrderStatusType[] = [
  "pending",
  "paid",
  "processing",
];

export const INITIAL_ORDER_STATUS: OrderStatusType = "pending";
export const ORDER_NUMBER_PREFIX = "ORD-";
export const FIRST_ORDER_NUMBER = 1001;
export const MAX_COMMENT_LENGTH = 300;
export const ORDER_NOT_FOUND_MESSAGE = "Заказ не найден";
export const ORDER_COUNT_FORMS: PluralFormsType = {
  one: "заказ",
  few: "заказа",
  many: "заказов",
};

export const CANCELLED_ORDER_STATUS: OrderStatusType = "cancelled";
export const buildQuantityExceedsStockMessage = (availableStock: number) =>
  `На складе только ${availableStock} шт.`;
export const ORDER_STATUS_CHANGE_FORBIDDEN_MESSAGE =
  "Этот переход статуса недоступен";

export const ORDER_VALIDATION_MESSAGES = {
  customer: "Выберите клиента",
  product: "Выберите товар",
  quantity: "Укажите целое количество от 1",
  noItems: "Добавьте хотя бы одну позицию",
  duplicateProducts: "Каждый товар можно добавить только один раз",
  comment: `Комментарий — не длиннее ${MAX_COMMENT_LENGTH} символов`,
};

export const emptyOrderFormItem: OrderFormItemType = {
  productId: "",
  quantity: 1,
};

export const orderFormDefaultValues: OrderFormValuesType = {
  customerId: "",
  items: [emptyOrderFormItem],
  comment: "",
};
