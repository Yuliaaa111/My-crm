import { UNKNOWN_ERROR_MESSAGE } from "@/core/constants/api";

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE;
