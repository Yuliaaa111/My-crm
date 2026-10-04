export type SessionUserType = {
  id: string;
  name: string;
  email: string;
};

export type SessionType = {
  accessToken: string;
  user: SessionUserType;
};

export type TokenPayloadType = {
  sub: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
};
