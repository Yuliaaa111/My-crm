import { ALL_FILTER_VALUE } from "@/core/constants/filters";
import type {
  BadgeToneType,
  ComboboxOptionType,
  SelectOptionType,
} from "@/core/types";
import { getCountryCodesByName, getCountryName } from "@/core/utils/countries";
import type {
  CustomerRequest,
  CustomerStatusFilterType,
  CustomerStatusType,
} from "./types";

export const CUSTOMER_STATUSES: CustomerStatusType[] = ["active", "inactive"];

export const CUSTOMER_STATUS_FILTERS: CustomerStatusFilterType[] = [
  ALL_FILTER_VALUE,
  ...CUSTOMER_STATUSES,
];

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatusType, string> = {
  active: "Активный",
  inactive: "Неактивный",
};

export const CUSTOMER_STATUS_TONES: Record<CustomerStatusType, BadgeToneType> =
  {
    active: "success",
    inactive: "neutral",
  };

export const CUSTOMER_STATUS_OPTIONS: SelectOptionType[] =
  CUSTOMER_STATUSES.map((status) => ({
    value: status,
    label: CUSTOMER_STATUS_LABELS[status],
  }));

export const CUSTOMER_STATUS_FILTER_OPTIONS: SelectOptionType[] = [
  { value: ALL_FILTER_VALUE, label: "Все статусы" },
  ...CUSTOMER_STATUS_OPTIONS,
];

export const CUSTOMER_NOT_FOUND_MESSAGE = "Клиент не найден";
export const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

export const CUSTOMER_VALIDATION_MESSAGES = {
  firstName: "Введите имя",
  lastName: "Введите фамилию",
  email: "Введите корректный email",
  phone: "Введите телефон: от 7 цифр, допустимы +, пробелы, скобки и дефисы",
  city: "Введите город",
  countryCode: "Выберите страну из списка",
};

export const DEFAULT_COUNTRY_CODE = "RU";

// The value is the ISO code that gets stored; the label is the name shown
// to the user. Both are searchable, so «RU» and «росс» find the same item.
export const COUNTRY_OPTIONS: ComboboxOptionType[] = getCountryCodesByName(
  DEFAULT_COUNTRY_CODE,
).map((countryCode) => {
  const countryName = getCountryName(countryCode);

  return {
    value: countryCode,
    label: countryName,
    description: countryCode,
    searchValues: [countryName, countryCode],
  };
});

export const customerFormDefaultValues: CustomerRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  status: "active",
};
