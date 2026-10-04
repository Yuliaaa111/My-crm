import type { SessionType } from "@/core/types";

export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = SessionType;

export type MockUserType = {
  id: string;
  name: string;
  email: string;
  password: string;
};
