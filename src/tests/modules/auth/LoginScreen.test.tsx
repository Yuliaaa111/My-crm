import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { parseTokenPayload } from "@/core/utils/jwt";
import { renderWithRouter } from "../../helpers/renderWithRouter";

const renderLogin = async () => {
  vi.resetModules();
  const [{ LoginScreen }, { useSessionStore }] = await Promise.all([
    import("@/modules/auth/public"),
    import("@/core/stores/sessionStore"),
  ]);
  const view = renderWithRouter(
    [
      { path: "/login", element: <LoginScreen /> },
      { path: "/", element: <p>Сводка</p> },
    ],
    "/login",
  );

  return { ...view, useSessionStore, user: userEvent.setup() };
};

describe("LoginScreen", () => {
  it("показывает ошибки валидации на пустой форме", async () => {
    const { user } = await renderLogin();

    await user.click(screen.getByRole("button", { name: "Войти" }));

    expect(
      await screen.findByText("Введите корректный email"),
    ).toBeInTheDocument();
    expect(screen.getByText("Введите пароль")).toBeInTheDocument();
  });

  it("при неверном пароле показывает ошибку и не входит", async () => {
    const { user, router, useSessionStore } = await renderLogin();

    await user.type(screen.getByLabelText("Email"), "demo@mycrm.test");
    await user.type(screen.getByLabelText("Пароль"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Войти" }));

    expect(
      await screen.findByText("Неверный email или пароль"),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
    expect(useSessionStore.getState().accessToken).toBeNull();
  });

  it("при верных данных входит: JWT с exp через час и переход на /", async () => {
    const { user, router, useSessionStore } = await renderLogin();

    await user.type(screen.getByLabelText("Email"), "  DEMO@mycrm.test ");
    await user.type(screen.getByLabelText("Пароль"), "demo12345");
    await user.click(screen.getByRole("button", { name: "Войти" }));

    expect(await screen.findByText("Сводка")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");

    const { accessToken, user: sessionUser } = useSessionStore.getState();
    const payload = parseTokenPayload(accessToken ?? "");
    expect(sessionUser?.name).toBe("Анна Демидова");
    expect(payload && payload.exp - payload.iat).toBe(3_600);
  });
});
