import { z } from "zod";

import { MILLISECONDS_IN_SECOND } from "@/core/constants/session";
import type { TokenPayloadType } from "@/core/types";

const TOKEN_PARTS_SEPARATOR = ".";
const TOKEN_PARTS_COUNT = 3;
const TOKEN_HEADER = { alg: "HS256", typ: "JWT" };
// There is no backend to sign or verify tokens, so the signature only
// keeps the three-part JWT shape; it protects nothing.
const MOCK_SIGNATURE = "mock-signature";

const tokenPayloadSchema: z.ZodType<TokenPayloadType> = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string(),
  iat: z.number(),
  exp: z.number(),
});

const encodeBase64Url = (text: string): string => {
  const binaryText = Array.from(new TextEncoder().encode(text), (byte) =>
    String.fromCharCode(byte),
  ).join("");

  return btoa(binaryText)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
};

const decodeBase64Url = (encodedText: string): string => {
  const binaryText = atob(
    encodedText.replaceAll("-", "+").replaceAll("_", "/"),
  );
  const bytes = Uint8Array.from(binaryText, (character) =>
    character.charCodeAt(0),
  );

  return new TextDecoder().decode(bytes);
};

export const getCurrentTimeInSeconds = (): number =>
  Math.floor(Date.now() / MILLISECONDS_IN_SECOND);

export const createToken = (payload: TokenPayloadType): string =>
  [
    encodeBase64Url(JSON.stringify(TOKEN_HEADER)),
    encodeBase64Url(JSON.stringify(payload)),
    encodeBase64Url(MOCK_SIGNATURE),
  ].join(TOKEN_PARTS_SEPARATOR);

export const parseTokenPayload = (token: string): TokenPayloadType | null => {
  const tokenParts = token.split(TOKEN_PARTS_SEPARATOR);

  if (tokenParts.length !== TOKEN_PARTS_COUNT) {
    return null;
  }

  try {
    const decodedPayload: unknown = JSON.parse(decodeBase64Url(tokenParts[1]));
    const parsedPayload = tokenPayloadSchema.safeParse(decodedPayload);

    return parsedPayload.success ? parsedPayload.data : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (
  token: string,
  currentTimeInSeconds: number = getCurrentTimeInSeconds(),
): boolean => {
  const payload = parseTokenPayload(token);

  return payload === null || payload.exp <= currentTimeInSeconds;
};

export const getMillisecondsUntilTokenExpires = (
  token: string,
  currentTimeInSeconds: number = getCurrentTimeInSeconds(),
): number => {
  const payload = parseTokenPayload(token);

  if (payload === null) {
    return 0;
  }

  return (
    Math.max(payload.exp - currentTimeInSeconds, 0) * MILLISECONDS_IN_SECOND
  );
};
