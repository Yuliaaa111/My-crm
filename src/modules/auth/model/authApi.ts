import { mockRequest } from "@/core/api/mockRequest";
import { TOKEN_LIFETIME_SECONDS } from "@/core/constants/session";
import { createToken, getCurrentTimeInSeconds } from "@/core/utils/jwt";
import { INVALID_CREDENTIALS_MESSAGE } from "./constants";
import { MOCK_USERS } from "./mocks";
import type { AuthRequest, AuthResponse } from "./types";

export const login = ({
  email,
  password,
}: AuthRequest): Promise<AuthResponse> =>
  mockRequest(() => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = MOCK_USERS.find(
      (mockUser) =>
        mockUser.email === normalizedEmail && mockUser.password === password,
    );

    if (!matchedUser) {
      throw new Error(INVALID_CREDENTIALS_MESSAGE);
    }

    const issuedAt = getCurrentTimeInSeconds();
    const user = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    };

    return {
      user,
      accessToken: createToken({
        sub: user.id,
        name: user.name,
        email: user.email,
        iat: issuedAt,
        exp: issuedAt + TOKEN_LIFETIME_SECONDS,
      }),
    };
  });
