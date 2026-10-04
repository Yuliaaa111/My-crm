import { mockRequest } from "@/core/api/mockRequest";
import { CUSTOMER_NOT_FOUND_MESSAGE } from "./constants";
import { MOCK_CUSTOMERS } from "./mocks";
import type {
  CustomerRequest,
  CustomerResponse,
  CustomersListResponse,
  CustomerType,
} from "./types";

// In-memory stand-in for the backend table: changes live until the page
// is reloaded, like in the original demo.
let customersTable: CustomerType[] = [...MOCK_CUSTOMERS];

const findCustomerOrThrow = (customerId: string): CustomerType => {
  const customer = customersTable.find(({ id }) => id === customerId);

  if (!customer) {
    throw new Error(CUSTOMER_NOT_FOUND_MESSAGE);
  }

  return customer;
};

export const fetchCustomers = (): Promise<CustomersListResponse> =>
  mockRequest(() => [...customersTable]);

export const createCustomer = (
  request: CustomerRequest,
): Promise<CustomerResponse> =>
  mockRequest(() => {
    const createdCustomer: CustomerType = {
      ...request,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    customersTable = [createdCustomer, ...customersTable];

    return createdCustomer;
  });

export const updateCustomer = (
  customerId: string,
  request: CustomerRequest,
): Promise<CustomerResponse> =>
  mockRequest(() => {
    const updatedCustomer: CustomerType = {
      ...findCustomerOrThrow(customerId),
      ...request,
    };
    customersTable = customersTable.map((customer) =>
      customer.id === customerId ? updatedCustomer : customer,
    );

    return updatedCustomer;
  });

export const deleteCustomer = (customerId: string): Promise<void> =>
  mockRequest(() => {
    findCustomerOrThrow(customerId);
    customersTable = customersTable.filter(({ id }) => id !== customerId);
  });
