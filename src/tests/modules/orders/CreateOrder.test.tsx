import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../helpers/renderWithRouter";
import { normalizeSpaces } from "../../helpers/text";

const renderOrders = async () => {
  vi.resetModules();
  const [{ OrdersListScreen, OrderDetailsScreen }, productsApi] =
    await Promise.all([
      import("@/modules/orders/public"),
      import("@/modules/products/model/productsApi"),
    ]);
  const view = renderWithRouter(
    [
      { path: "/orders", element: <OrdersListScreen /> },
      { path: "/orders/:orderId", element: <OrderDetailsScreen /> },
    ],
    "/orders",
  );
  await screen.findByText("Показано 30 из 30");
  const user = userEvent.setup();

  await user.click(screen.getByRole("button", { name: "Новый заказ" }));
  const dialog = await screen.findByRole("dialog", { name: "Новый заказ" });
  await within(dialog).findByRole("combobox", { name: "Клиент" });

  return { ...view, user, dialog, productsApi };
};

const pick = async (
  user: ReturnType<typeof userEvent.setup>,
  combobox: HTMLElement,
  query: string,
) => {
  await user.click(combobox);
  await user.keyboard(`${query}{Enter}`);
};

describe("создание заказа", () => {
  it("пустая форма — ошибки у клиента и товара", async () => {
    const { user, dialog } = await renderOrders();

    await user.click(
      within(dialog).getByRole("button", { name: "Создать заказ" }),
    );

    expect(
      await within(dialog).findByText("Выберите клиента"),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Выберите товар")).toBeInTheDocument();
  });

  it("больше остатка — ошибка у позиции, заказ не создаётся", async () => {
    const { user, dialog, router } = await renderOrders();

    await pick(
      user,
      within(dialog).getByRole("combobox", { name: "Клиент" }),
      "Смирнова",
    );
    await pick(
      user,
      within(dialog).getByRole("combobox", { name: "Товар 1" }),
      "MN-VST",
    );
    const quantity = within(dialog).getByLabelText("Кол-во");
    await user.clear(quantity);
    await user.type(quantity, "9");
    await user.click(
      within(dialog).getByRole("button", { name: "Создать заказ" }),
    );

    expect(
      await within(dialog).findByText("На складе только 8 шт."),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/orders");
  });

  it("создаёт заказ, открывает его карточку и списывает остаток", async () => {
    const { user, dialog, router, productsApi } = await renderOrders();

    await pick(
      user,
      within(dialog).getByRole("combobox", { name: "Клиент" }),
      "Смирнова",
    );
    await pick(
      user,
      within(dialog).getByRole("combobox", { name: "Товар 1" }),
      "MN-VST",
    );
    const quantity = within(dialog).getByLabelText("Кол-во");
    await user.clear(quantity);
    await user.type(quantity, "5");
    expect(normalizeSpaces(dialog.textContent ?? "")).toContain("162 450 ₽");

    await user.click(
      within(dialog).getByRole("button", { name: "Создать заказ" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Заказ ORD-1031" }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toMatch(/^\/orders\/.+/);
    expect(screen.getByText("Мария Смирнова")).toBeInTheDocument();
    await waitFor(async () => {
      const monitor = (await productsApi.fetchProducts()).find(
        ({ id }) => id === "product-2",
      );
      expect(monitor?.stock).toBe(3);
    });
  });

  it("один товар в двух позициях — ошибка", async () => {
    const { user, dialog } = await renderOrders();

    await pick(
      user,
      within(dialog).getByRole("combobox", { name: "Клиент" }),
      "Смирнова",
    );
    await pick(
      user,
      within(dialog).getByRole("combobox", { name: "Товар 1" }),
      "AC-GLD",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Добавить позицию" }),
    );
    await pick(
      user,
      within(dialog).getByRole("combobox", { name: "Товар 2" }),
      "AC-GLD",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Создать заказ" }),
    );

    expect(
      await within(dialog).findByText(
        "Каждый товар можно добавить только один раз",
      ),
    ).toBeInTheDocument();
  });
});
