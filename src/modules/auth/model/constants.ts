import type { AuthRequest } from "./types";

export const INVALID_EMAIL_MESSAGE = "Введите корректный email";
export const REQUIRED_PASSWORD_MESSAGE = "Введите пароль";
export const INVALID_CREDENTIALS_MESSAGE = "Неверный email или пароль";

export const DEMO_CREDENTIALS: AuthRequest = {
  email: "demo@mycrm.test",
  password: "demo12345",
};

export const loginFormDefaultValues: AuthRequest = {
  email: "",
  password: "",
};
