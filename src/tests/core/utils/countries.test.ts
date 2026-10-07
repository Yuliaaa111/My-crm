import { describe, expect, it } from "vitest";

import { ISO_COUNTRY_CODES } from "@/core/constants/countryCodes";
import {
  getCountryCodesByName,
  getCountryName,
  isCountryCode,
} from "@/core/utils/countries";

describe("countries", () => {
  it("в списке 249 уникальных кодов ISO 3166-1 alpha-2", () => {
    expect(ISO_COUNTRY_CODES).toHaveLength(249);
    expect(new Set(ISO_COUNTRY_CODES).size).toBe(249);
    expect(ISO_COUNTRY_CODES.every((code) => /^[A-Z]{2}$/.test(code))).toBe(
      true,
    );
  });

  it("называет страну по-русски", () => {
    expect(getCountryName("RU")).toBe("Россия");
    expect(getCountryName("BY")).toBe("Беларусь");
    expect(getCountryName("KZ")).toBe("Казахстан");
  });

  it("у каждого кода есть название, отличное от самого кода", () => {
    const codesWithoutName = ISO_COUNTRY_CODES.filter(
      (code) => getCountryName(code) === code,
    );

    expect(codesWithoutName).toEqual([]);
  });

  it("проверяет код по списку ISO", () => {
    expect(isCountryCode("RU")).toBe(true);
    expect(isCountryCode("ru")).toBe(false);
    expect(isCountryCode("XX")).toBe(false);
    expect(isCountryCode("Россия")).toBe(false);
  });

  it("ставит выбранную страну первой, остальные — по алфавиту названий", () => {
    const codes = getCountryCodesByName("RU");
    const otherNames = codes.slice(1).map(getCountryName);
    const sortedNames = [...otherNames].sort((first, second) =>
      first.localeCompare(second, "ru-RU"),
    );

    expect(codes[0]).toBe("RU");
    expect(codes).toHaveLength(249);
    expect(new Set(codes).size).toBe(249);
    expect(otherNames).toEqual(sortedNames);
  });
});
