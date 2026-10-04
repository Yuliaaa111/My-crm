import {
  MOCK_REQUEST_DELAY_MS,
  UNKNOWN_ERROR_MESSAGE,
} from "@/core/constants/api";

// Stands in for a network call while there is no backend: resolves with
// the result of `resolveResponse` after a delay, or rejects with the
// error it throws — the same way a real request would fail.
export const mockRequest = <ResponseData>(
  resolveResponse: () => ResponseData,
  delayMs: number = MOCK_REQUEST_DELAY_MS,
): Promise<ResponseData> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(resolveResponse());
      } catch (error) {
        reject(
          error instanceof Error ? error : new Error(UNKNOWN_ERROR_MESSAGE),
        );
      }
    }, delayMs);
  });
