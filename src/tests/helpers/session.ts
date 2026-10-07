import { SESSION_STORAGE_KEY } from "@/core/constants/session";
import type { SessionUserType } from "@/core/types";
import { createToken, getCurrentTimeInSeconds } from "@/core/utils/jwt";

export const TEST_USER: SessionUserType = {
  id: "user-1",
  name: "Анна Демидова",
  email: "demo@mycrm.test",
};

export const createTestToken = (secondsUntilExpiry: number): string => {
  const issuedAt = getCurrentTimeInSeconds();

  return createToken({
    sub: TEST_USER.id,
    name: TEST_USER.name,
    email: TEST_USER.email,
    iat: issuedAt,
    exp: issuedAt + secondsUntilExpiry,
  });
};

// Writes a session the way zustand persist stores it, so a freshly
// imported sessionStore restores it on creation.
export const storeSession = (accessToken: string): void => {
  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ state: { accessToken, user: TEST_USER }, version: 0 }),
  );
};
