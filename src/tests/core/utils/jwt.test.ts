import { describe, expect, it, vi } from "vitest";

import {
  createToken,
  getMillisecondsUntilTokenExpires,
  isTokenExpired,
  parseTokenPayload,
} from "@/core/utils/jwt";

const payload = {
  sub: "user-1",
  name: "Анна Демидова",
  email: "demo@mycrm.test",
  iat: 1_000,
  exp: 4_600,
};

describe("jwt", () => {
  it("собирает токен из трёх частей с заголовком JWT", () => {
    const [header, body, signature] = createToken(payload).split(".");
    const decodedHeader: unknown = JSON.parse(atob(header));

    expect(decodedHeader).toEqual({ alg: "HS256", typ: "JWT" });
    expect(body).not.toMatch(/[+/=]/);
    expect(signature).toBeTruthy();
  });

  it("разбирает собственный токен, включая кириллицу", () => {
    expect(parseTokenPayload(createToken(payload))).toEqual(payload);
  });

  it.each([
    ["не три части", "abc.def"],
    ["не base64", "a.@@@.c"],
    ["не JSON", `a.${btoa("not json")}.c`],
    ["нет обязательных полей", `a.${btoa(JSON.stringify({ sub: "1" }))}.c`],
  ])("возвращает null, если токен испорчен: %s", (_, token) => {
    expect(parseTokenPayload(token)).toBeNull();
  });

  it("считает токен истёкшим, когда текущее время дошло до exp", () => {
    const token = createToken(payload);

    expect(isTokenExpired(token, 4_599)).toBe(false);
    expect(isTokenExpired(token, 4_600)).toBe(true);
  });

  it("считает испорченный токен истёкшим", () => {
    expect(isTokenExpired("garbage.token")).toBe(true);
  });

  it("по умолчанию сравнивает с текущим временем", () => {
    vi.useFakeTimers();
    vi.setSystemTime(4_599_000);

    expect(isTokenExpired(createToken(payload))).toBe(false);
  });

  it("считает миллисекунды до истечения и не уходит в минус", () => {
    const token = createToken(payload);

    expect(getMillisecondsUntilTokenExpires(token, 4_590)).toBe(10_000);
    expect(getMillisecondsUntilTokenExpires(token, 9_999)).toBe(0);
    expect(getMillisecondsUntilTokenExpires("garbage")).toBe(0);
  });
});
