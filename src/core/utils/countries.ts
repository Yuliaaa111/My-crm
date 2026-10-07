import { APP_LOCALE } from "@/core/constants/app";
import { ISO_COUNTRY_CODES } from "@/core/constants/countryCodes";

const countryDisplayNames = new Intl.DisplayNames([APP_LOCALE], {
  type: "region",
});

export const isCountryCode = (value: string): boolean =>
  ISO_COUNTRY_CODES.includes(value);

// Data keeps the ISO code; the name is only for display, so it can follow
// the interface language without touching stored records.
export const getCountryName = (countryCode: string): string =>
  countryDisplayNames.of(countryCode) ?? countryCode;

// All country codes ordered by their displayed name, with one chosen
// country moved to the top (the one most customers come from).
export const getCountryCodesByName = (firstCountryCode: string): string[] => [
  firstCountryCode,
  ...ISO_COUNTRY_CODES.filter(
    (countryCode) => countryCode !== firstCountryCode,
  ).sort((first, second) =>
    getCountryName(first).localeCompare(getCountryName(second), APP_LOCALE),
  ),
];
