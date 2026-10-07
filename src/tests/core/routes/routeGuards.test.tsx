import { act, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../helpers/renderWithRouter";
import { createTestToken, storeSession } from "../../helpers/session";

const renderGuards = async (initialPath: string) => {
  vi.resetModules();
  const [{ PrivateRoute }, { GuestRoute }, { Header }] = await Promise.all([
    import("@/core/routes/PrivateRoute"),
    import("@/core/routes/GuestRoute"),
    import("@/core/layouts/Header/Header"),
  ]);

  return renderWithRouter(
    [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Header />
            <p>Защищённая страница</p>
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <GuestRoute>
            <p>Страница входа</p>
          </GuestRoute>
        ),
      },
    ],
    initialPath,
  );
};

describe("PrivateRoute", () => {
  it("без токена перенаправляет на /login", async () => {
    const { router } = await renderGuards("/");

    expect(await screen.findByText("Страница входа")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
  });

  it("с действующим токеном показывает страницу", async () => {
    storeSession(createTestToken(3_600));
    await renderGuards("/");

    expect(await screen.findByText("Защищённая страница")).toBeInTheDocument();
  });

  it("с истёкшим токеном выходит и перенаправляет на /login", async () => {
    storeSession(createTestToken(-1));
    await renderGuards("/");

    expect(await screen.findByText("Страница входа")).toBeInTheDocument();
  });

  it("выходит по таймеру в момент истечения токена", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    storeSession(createTestToken(5));
    await renderGuards("/");
    expect(screen.getByText("Защищённая страница")).toBeInTheDocument();

    await act(() => vi.advanceTimersByTimeAsync(5_000));

    expect(screen.getByText("Страница входа")).toBeInTheDocument();
  });

  it("кнопка «Выйти» в шапке завершает сессию", async () => {
    storeSession(createTestToken(3_600));
    await renderGuards("/");

    await userEvent
      .setup()
      .click(await screen.findByRole("button", { name: "Выйти" }));

    expect(await screen.findByText("Страница входа")).toBeInTheDocument();
    expect(window.localStorage.getItem("my-crm-session")).toContain(
      '"accessToken":null',
    );
  });
});

describe("GuestRoute", () => {
  it("без сессии показывает страницу входа", async () => {
    await renderGuards("/login");

    expect(await screen.findByText("Страница входа")).toBeInTheDocument();
  });

  it("вошедшего пользователя перенаправляет с /login на /", async () => {
    storeSession(createTestToken(3_600));
    const { router } = await renderGuards("/login");

    expect(await screen.findByText("Защищённая страница")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/");
  });
});
