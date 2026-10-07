import { beforeEach, describe, expect, it, vi } from "vitest";

import { SESSION_STORAGE_KEY } from "@/core/constants/session";
import { THEME_STORAGE_KEY } from "@/core/constants/theme";
import {
  createTestToken,
  storeSession,
  TEST_USER,
} from "../../helpers/session";

const loadStores = async () => {
  vi.resetModules();

  const [{ useSessionStore }, { useThemeStore }] = await Promise.all([
    import("@/core/stores/sessionStore"),
    import("@/core/stores/themeStore"),
  ]);

  return { useSessionStore, useThemeStore };
};

describe("sessionStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("входит в сессию и сохраняет токен и пользователя в localStorage", async () => {
    const { useSessionStore } = await loadStores();
    const accessToken = createTestToken(3_600);

    useSessionStore.getState().startSession({ accessToken, user: TEST_USER });

    expect(useSessionStore.getState()).toMatchObject({
      accessToken,
      user: TEST_USER,
    });
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toContain(
      accessToken,
    );
  });

  it("logout очищает сессию", async () => {
    const { useSessionStore } = await loadStores();
    useSessionStore
      .getState()
      .startSession({ accessToken: createTestToken(3_600), user: TEST_USER });

    useSessionStore.getState().logout();

    expect(useSessionStore.getState()).toMatchObject({
      accessToken: null,
      user: null,
    });
  });

  it("восстанавливает действующую сессию после «перезагрузки»", async () => {
    const accessToken = createTestToken(3_600);
    storeSession(accessToken);

    const { useSessionStore } = await loadStores();

    expect(useSessionStore.getState().accessToken).toBe(accessToken);
  });

  it("истёкший токен из хранилища сразу сбрасывается", async () => {
    storeSession(createTestToken(-10));

    const { useSessionStore } = await loadStores();

    expect(useSessionStore.getState().accessToken).toBeNull();
  });
});

describe("themeStore", () => {
  it("переключает тему туда и обратно и сохраняет выбор", async () => {
    const { useThemeStore } = await loadStores();
    const initialMode = useThemeStore.getState().mode;

    useThemeStore.getState().toggleMode();
    const toggledMode = useThemeStore.getState().mode;
    useThemeStore.getState().toggleMode();

    expect(toggledMode).not.toBe(initialMode);
    expect(useThemeStore.getState().mode).toBe(initialMode);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toContain(
      initialMode,
    );
  });

  it("восстанавливает сохранённую тему", async () => {
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({ state: { mode: "dark" }, version: 0 }),
    );

    const { useThemeStore } = await loadStores();

    expect(useThemeStore.getState().mode).toBe("dark");
  });
});
