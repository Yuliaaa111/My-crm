import { mockRequest } from "@/core/api/mockRequest";
import {
  releaseProductsStock,
  reserveProductsStock,
  type StockChangeType,
} from "@/modules/products/public";
import {
  CANCELLED_ORDER_STATUS,
  FIRST_ORDER_NUMBER,
  INITIAL_ORDER_STATUS,
  ORDER_NOT_FOUND_MESSAGE,
  ORDER_NUMBER_PREFIX,
  ORDER_STATUS_CHANGE_FORBIDDEN_MESSAGE,
  ORDER_STATUS_TRANSITIONS,
  STOCK_HOLDING_STATUSES,
} from "./constants";
import { MOCK_ORDERS } from "./mocks";
import type {
  OrderItemType,
  OrderRequest,
  OrderResponse,
  OrdersListResponse,
  OrderStatusRequest,
  OrderType,
} from "./types";

// In-memory stand-in for the backend table: changes live until the page
// is reloaded, like in the original demo.
let ordersTable: OrderType[] = [...MOCK_ORDERS];

const findOrderOrThrow = (orderId: string): OrderType => {
  const order = ordersTable.find(({ id }) => id === orderId);

  if (!order) {
    throw new Error(ORDER_NOT_FOUND_MESSAGE);
  }

  return order;
};

const toStockChanges = (items: OrderItemType[]): StockChangeType[] =>
  items.map(({ productId, quantity }) => ({ productId, quantity }));

const getNextOrderNumber = (): string => {
  const lastNumber = ordersTable.reduce(
    (maxNumber, { number }) =>
      Math.max(maxNumber, Number(number.replace(ORDER_NUMBER_PREFIX, ""))),
    FIRST_ORDER_NUMBER - 1,
  );

  return `${ORDER_NUMBER_PREFIX}${lastNumber + 1}`;
};

export const fetchOrders = (): Promise<OrdersListResponse> =>
  mockRequest(() => [...ordersTable]);

export const createOrder = (request: OrderRequest): Promise<OrderResponse> =>
  mockRequest(() => {
    reserveProductsStock(toStockChanges(request.items));

    const createdAt = new Date().toISOString();
    const createdOrder: OrderType = {
      ...request,
      id: crypto.randomUUID(),
      number: getNextOrderNumber(),
      status: INITIAL_ORDER_STATUS,
      createdAt,
      statusHistory: [{ status: INITIAL_ORDER_STATUS, changedAt: createdAt }],
    };
    ordersTable = [createdOrder, ...ordersTable];

    return createdOrder;
  });

export const updateOrderStatus = (
  orderId: string,
  { status }: OrderStatusRequest,
): Promise<OrderResponse> =>
  mockRequest(() => {
    const order = findOrderOrThrow(orderId);

    if (!ORDER_STATUS_TRANSITIONS[order.status].includes(status)) {
      throw new Error(ORDER_STATUS_CHANGE_FORBIDDEN_MESSAGE);
    }

    if (status === CANCELLED_ORDER_STATUS) {
      releaseProductsStock(toStockChanges(order.items));
    }

    const updatedOrder: OrderType = {
      ...order,
      status,
      statusHistory: [
        ...order.statusHistory,
        { status, changedAt: new Date().toISOString() },
      ],
    };
    ordersTable = ordersTable.map((existingOrder) =>
      existingOrder.id === orderId ? updatedOrder : existingOrder,
    );

    return updatedOrder;
  });

export const deleteOrder = (orderId: string): Promise<void> =>
  mockRequest(() => {
    const order = findOrderOrThrow(orderId);

    if (STOCK_HOLDING_STATUSES.includes(order.status)) {
      releaseProductsStock(toStockChanges(order.items));
    }

    ordersTable = ordersTable.filter(({ id }) => id !== orderId);
  });
