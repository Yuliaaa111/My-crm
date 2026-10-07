import { APP_CURRENCY, APP_LOCALE } from "@/core/constants/app";

const currencyFormatter = new Intl.NumberFormat(APP_LOCALE, {
  style: "currency",
  currency: APP_CURRENCY,
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount: number): string =>
  currencyFormatter.format(amount);
