import { afterEach, describe, expect, it, vi } from "vitest";

import { mockRequest } from "@/core/api/mockRequest";

// The shared test setup replaces mockRequest with an instant version;
// this file checks the real one, delay included.
vi.unmock("@/core/api/mockRequest");

describe("mockRequest", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("отдаёт результат только после задержки", async () => {
    vi.useFakeTimers();
    const onResolved = vi.fn();
    mockRequest(() => "данные", 400).then(onResolved);

    await vi.advanceTimersByTimeAsync(399);
    expect(onResolved).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(onResolved).toHaveBeenCalledWith("данные");
  });

  it("отклоняется ошибкой, которую бросил обработчик", async () => {
    vi.useFakeTimers();
    const request = mockRequest(() => {
      throw new Error("Клиент не найден");
    }, 10);
    const assertion = expect(request).rejects.toThrow("Клиент не найден");

    await vi.advanceTimersByTimeAsync(10);
    await assertion;
  });

  it("заменяет не-ошибку на общее сообщение", async () => {
    vi.useFakeTimers();
    const request = mockRequest(() => {
      // Deliberately throwing a non-Error value to cover that branch.
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw "строка";
    }, 10);
    const assertion = expect(request).rejects.toThrow(
      "Что-то пошло не так. Попробуйте ещё раз.",
    );

    await vi.advanceTimersByTimeAsync(10);
    await assertion;
  });
});
