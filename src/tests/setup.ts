import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// The real mockRequest waits 400 ms to imitate the network. Tests get the
// same contract — resolve with the result, reject with the thrown error —
// without the delay. The mockRequest test itself uses the real module.
vi.mock("@/core/api/mockRequest", () => ({
  mockRequest: <ResponseData>(
    resolveResponse: () => ResponseData,
  ): Promise<ResponseData> =>
    new Promise((resolve, reject) => {
      try {
        resolve(resolveResponse());
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    }),
}));

// jsdom has no layout engine, so scrollIntoView is missing; the combobox
// calls it to keep the highlighted option visible.
Element.prototype.scrollIntoView = vi.fn();

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.useRealTimers();
});
