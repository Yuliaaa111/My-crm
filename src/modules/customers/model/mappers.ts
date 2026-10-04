import { formatDate } from "@/core/utils/formatDate";
import type { CustomerRequest, CustomerType, CustomerViewType } from "./types";

export const getCustomerFullName = ({
  firstName,
  lastName,
}: Pick<CustomerType, "firstName" | "lastName">): string =>
  `${firstName} ${lastName}`;

export const getCustomerLocation = ({
  city,
  country,
}: Pick<CustomerType, "city" | "country">): string => `${city}, ${country}`;

export const toCustomerView = (customer: CustomerType): CustomerViewType => ({
  ...customer,
  fullName: getCustomerFullName(customer),
  location: getCustomerLocation(customer),
  createdAtLabel: formatDate(customer.createdAt),
});

export const toCustomerRequest = ({
  firstName,
  lastName,
  email,
  phone,
  company,
  city,
  country,
  status,
}: CustomerType): CustomerRequest => ({
  firstName,
  lastName,
  email,
  phone,
  company,
  city,
  country,
  status,
});
