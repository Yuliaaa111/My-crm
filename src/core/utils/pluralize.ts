import { APP_LOCALE } from "@/core/constants/app";

export type PluralFormsType = {
  one: string;
  few: string;
  many: string;
};

const pluralRules = new Intl.PluralRules(APP_LOCALE);

export const pluralize = (count: number, forms: PluralFormsType): string => {
  const pluralCategory = pluralRules.select(count);

  if (pluralCategory === "one") {
    return forms.one;
  }

  return pluralCategory === "few" ? forms.few : forms.many;
};
