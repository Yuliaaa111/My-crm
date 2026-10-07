import { getCountryName } from "@/core/utils/countries";
import { formatDate } from "@/core/utils/formatDate";
import type { CustomerRequest, CustomerType, CustomerViewType } from "./types";

export const getCustomerFullName = ({
  firstName,
  lastName,
}: Pick<CustomerType, "firstName" | "lastName">): string =>
  `${firstName} ${lastName}`;

export const getCustomerLocation = ({
  city,
  countryCode,
}: Pick<CustomerType, "city" | "countryCode">): string =>
  `${city}, ${getCountryName(countryCode)}`;

export const toCustomerView = (customer: CustomerType): CustomerViewType => ({
  ...customer,
  fullName: getCustomerFullName(customer),
  countryName: getCountryName(customer.countryCode),
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
  countryCode,
  status,
}: CustomerType): CustomerRequest => ({
  firstName,
  lastName,
  email,
  phone,
  company,
  city,
  countryCode,
  status,
});
