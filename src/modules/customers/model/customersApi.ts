import { mockRequest } from "@/core/api/mockRequest";
import { createMockTable } from "@/core/api/mockTable";
import { CUSTOMER_NOT_FOUND_MESSAGE } from "./constants";
import { MOCK_CUSTOMERS } from "./mocks";
import { customerRecordSchema } from "./schema";
import type {
  CustomerRequest,
  CustomerResponse,
  CustomersListResponse,
  CustomerType,
} from "./types";

// Stand-in for the backend table, persisted to localStorage (see
// core/api/mockTable.ts).
const customersTable = createMockTable({
  tableName: "customers",
  rowSchema: customerRecordSchema,
  initialRows: MOCK_CUSTOMERS,
});

const findCustomerOrThrow = (customerId: string): CustomerType => {
  const customer = customersTable
    .readRows()
    .find(({ id }) => id === customerId);

  if (!customer) {
    throw new Error(CUSTOMER_NOT_FOUND_MESSAGE);
  }

  return customer;
};

export const fetchCustomers = (): Promise<CustomersListResponse> =>
  mockRequest(() => customersTable.readRows());

export const createCustomer = (
  request: CustomerRequest,
): Promise<CustomerResponse> =>
  mockRequest(() => {
    const createdCustomer: CustomerType = {
      ...request,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    customersTable.writeRows([createdCustomer, ...customersTable.readRows()]);

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
    customersTable.writeRows(
      customersTable
        .readRows()
        .map((customer) =>
          customer.id === customerId ? updatedCustomer : customer,
        ),
    );

    return updatedCustomer;
  });

export const deleteCustomer = (customerId: string): Promise<void> =>
  mockRequest(() => {
    findCustomerOrThrow(customerId);
    customersTable.writeRows(
      customersTable.readRows().filter(({ id }) => id !== customerId),
    );
  });
