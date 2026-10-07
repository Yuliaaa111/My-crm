import { describe, expect, it } from "vitest";

import { buildDetailsPath } from "@/core/utils/buildDetailsPath";
import { buildTheme } from "@/core/utils/buildTheme";
import { getErrorMessage } from "@/core/utils/getErrorMessage";

describe("buildDetailsPath", () => {
  it("добавляет id к пути списка и экранирует спецсимволы", () => {
    expect(buildDetailsPath("/customers", "customer-1")).toBe(
      "/customers/customer-1",
    );
    expect(buildDetailsPath("/orders", "a/b c")).toBe("/orders/a%2Fb%20c");
  });
});

describe("getErrorMessage", () => {
  it("берёт текст ошибки или подставляет общий", () => {
    expect(getErrorMessage(new Error("Клиент не найден"))).toBe(
      "Клиент не найден",
    );
    expect(getErrorMessage("строка")).toBe(
      "Что-то пошло не так. Попробуйте ещё раз.",
    );
  });
});

describe("buildTheme", () => {
  it("собирает светлую и тёмную темы с разными цветами", () => {
    const lightTheme = buildTheme("light");
    const darkTheme = buildTheme("dark");

    expect(lightTheme.mode).toBe("light");
    expect(darkTheme.mode).toBe("dark");
    expect(lightTheme.colors.background).not.toBe(darkTheme.colors.background);
    expect(lightTheme.fonts).toBe(darkTheme.fonts);
  });
});
