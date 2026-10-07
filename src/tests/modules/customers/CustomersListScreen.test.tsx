import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "../../helpers/renderWithRouter";

const renderCustomers = async () => {
  vi.resetModules();
  const { CustomersListScreen } = await import("@/modules/customers/public");
  const view = renderWithRouter(
    [
      { path: "/customers", element: <CustomersListScreen /> },
      { path: "/customers/:customerId", element: <p>Карточка клиента</p> },
    ],
    "/customers",
  );
  await screen.findByText("Показано 20 из 20");

  return { ...view, user: userEvent.setup() };
};

const tableRows = () => screen.getAllByRole("row").slice(1);

describe("CustomersListScreen", () => {
  it("показывает первые 10 клиентов, город и страну", async () => {
    await renderCustomers();

    expect(tableRows()).toHaveLength(10);
    expect(tableRows()[0]).toHaveTextContent("Иван Петров");
    expect(tableRows()[0]).toHaveTextContent("МоскваРоссия");
    expect(screen.getByText("Страница 1 из 2")).toBeInTheDocument();
  });

  it("ищет и фильтрует по статусу", async () => {
    const { user } = await renderCustomers();

    await user.type(screen.getByLabelText("Поиск клиентов"), "казань");
    expect(tableRows()).toHaveLength(1);
    expect(screen.getByText("Показано 1 из 20")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Поиск клиентов"));
    await user.selectOptions(
      screen.getByLabelText("Фильтр по статусу"),
      "inactive",
    );
    expect(tableRows()).toHaveLength(4);
  });

  it("клик по строке открывает карточку", async () => {
    const { user, router } = await renderCustomers();

    await user.click(tableRows()[0]);

    expect(await screen.findByText("Карточка клиента")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/customers/customer-1");
  });

  it("форма: ошибки на пустых полях, затем создание клиента со страной из списка", async () => {
    const { user } = await renderCustomers();

    await user.click(screen.getByRole("button", { name: "Добавить клиента" }));
    const dialog = screen.getByRole("dialog", { name: "Новый клиент" });
    await user.click(within(dialog).getByRole("button", { name: "Сохранить" }));

    expect(await within(dialog).findByText("Введите имя")).toBeInTheDocument();
    expect(
      within(dialog).getByText("Введите корректный email"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("combobox", { name: "Страна" }),
    ).toHaveValue("Россия");

    await user.type(within(dialog).getByLabelText("Имя"), "Айгерим");
    await user.type(within(dialog).getByLabelText("Фамилия"), "Тестова");
    await user.type(within(dialog).getByLabelText("Email"), "aigerim@test.kz");
    await user.type(
      within(dialog).getByLabelText("Телефон"),
      "+7 701 000-00-00",
    );
    await user.type(within(dialog).getByLabelText("Город"), "Астана");
    await user.click(within(dialog).getByRole("combobox", { name: "Страна" }));
    await user.keyboard("kz{Enter}");
    await user.click(within(dialog).getByRole("button", { name: "Сохранить" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Показано 21 из 21")).toBeInTheDocument();
    expect(tableRows()[0]).toHaveTextContent("Айгерим Тестова");
    expect(tableRows()[0]).toHaveTextContent("АстанаКазахстан");

    const storedCustomers: unknown = JSON.parse(
      window.localStorage.getItem("my-crm-mock:v2:customers") ?? "null",
    );
    expect(storedCustomers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ lastName: "Тестова", countryCode: "KZ" }),
      ]),
    );
  });

  it("правка подставляет данные клиента и сохраняет изменения", async () => {
    const { user } = await renderCustomers();

    await user.click(
      within(tableRows()[0]).getByRole("button", { name: "Редактировать" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Редактирование клиента",
    });
    const cityInput = within(dialog).getByLabelText("Город");
    expect(cityInput).toHaveValue("Москва");

    await user.clear(cityInput);
    await user.type(cityInput, "Кострома");
    await user.click(within(dialog).getByRole("button", { name: "Сохранить" }));

    await waitFor(() => expect(tableRows()[0]).toHaveTextContent("Кострома"));
  });

  it("удаление спрашивает подтверждение и убирает клиента", async () => {
    const { user } = await renderCustomers();

    await user.click(
      within(tableRows()[0]).getByRole("button", { name: "Удалить" }),
    );
    const dialog = screen.getByRole("dialog", { name: "Удалить клиента?" });
    expect(dialog).toHaveTextContent("«Иван Петров» будет удалён");

    await user.click(within(dialog).getByRole("button", { name: "Удалить" }));

    expect(await screen.findByText("Показано 19 из 19")).toBeInTheDocument();
    expect(screen.queryByText("Иван Петров")).not.toBeInTheDocument();
  });
});
