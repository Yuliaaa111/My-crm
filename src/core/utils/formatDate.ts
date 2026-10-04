import { APP_LOCALE } from "@/core/constants/app";

const dateFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const formatDate = (isoDate: string): string =>
  dateFormatter.format(new Date(isoDate));
