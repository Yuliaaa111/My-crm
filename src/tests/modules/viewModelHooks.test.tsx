import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RouterWrapper } from "../helpers/routerWrapper";
import { normalizeSpaces } from "../helpers/text";

describe("useCustomersList", () => {
  const renderCustomersList = async () => {
    vi.resetModules();
    const { useCustomersList } =
      await import("@/modules/customers/viewModel/useCustomersList");

    // A bare-bones stand for the hook: real input and select elements
    // deliver real change events to its handlers.
    const Stand = () => {
      const list = useCustomersList();

      return (
        <>
          <input
            aria-label="Поиск"
            value={list.searchQuery}
            onChange={list.handleSearchChange}
          />
          <select
            aria-label="Статус"
            value={list.statusFilter}
            onChange={list.handleStatusFilterChange}
          >
            <option value="all">Все</option>
            <option value="active">Активный</option>
            <option value="inactive">Неактивный</option>
            <option value="unknown">Неизвестный</option>
          </select>
          <button type="button" onClick={() => list.setPage(2)}>
            Страница 2
          </button>
          <output>
            {list.isLoading
              ? "загрузка"
              : `${list.filteredCount}/${list.totalCount} стр. ${list.page}/${list.pageCount}: ${list.pageCustomers
                  .map(({ fullName }) => fullName)
                  .join(", ")}`}
          </output>
        </>
      );
    };

    render(<Stand />, { wrapper: RouterWrapper });
    await waitFor(() =>
      expect(screen.getByRole("status")).not.toHaveTextContent("загрузка"),
    );
  };

  it("загружает клиентов и показывает первую страницу из 10", async () => {
    await renderCustomersList();

    expect(screen.getByRole("status")).toHaveTextContent(
      /^20\/20 стр\. 1\/2: Иван Петров,/,
    );
  });

  it("поиск фильтрует и сбрасывает на первую страницу", async () => {
    const user = userEvent.setup();
    await renderCustomersList();

    await user.click(screen.getByRole("button", { name: "Страница 2" }));
    expect(screen.getByRole("status")).toHaveTextContent("стр. 2/2");

    await user.type(screen.getByLabelText("Поиск"), "казань");
    expect(screen.getByRole("status")).toHaveTextContent(
      "1/20 стр. 1/1: Алексей Кузнецов",
    );
  });

  it("ищет по названию и коду страны", async () => {
    const user = userEvent.setup();
    await renderCustomersList();

    await user.type(screen.getByLabelText("Поиск"), "беларусь");
    expect(screen.getByRole("status")).toHaveTextContent(
      "1/20 стр. 1/1: Никита Новиков",
    );

    await user.clear(screen.getByLabelText("Поиск"));
    await user.type(screen.getByLabelText("Поиск"), "BY");
    expect(screen.getByRole("status")).toHaveTextContent("Никита Новиков");
  });

  it("фильтр по статусу и игнорирование неизвестного значения", async () => {
    const user = userEvent.setup();
    await renderCustomersList();

    await user.selectOptions(screen.getByLabelText("Статус"), "inactive");
    expect(screen.getByRole("status")).toHaveTextContent(/^4\/20/);

    await user.selectOptions(screen.getByLabelText("Статус"), "unknown");
    expect(screen.getByRole("status")).toHaveTextContent(/^4\/20/);
  });
});

describe("useCustomerOrders", () => {
  it("находит заказы клиента, новые сверху, сумма без отменённых", async () => {
    vi.resetModules();
    const { useCustomerOrders } =
      await import("@/modules/orders/viewModel/useCustomerOrders");
    const { result } = renderHook(() => useCustomerOrders("customer-1"), {
      wrapper: RouterWrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.customerOrders.map(({ number }) => number)).toEqual([
      "ORD-1028",
      "ORD-1026",
    ]);
    expect(normalizeSpaces(result.current.summary)).toBe(
      "2 заказа на сумму 58 980 ₽ без учёта отменённых",
    );
  });

  it("у клиента без заказов — пустой список", async () => {
    vi.resetModules();
    const { useCustomerOrders } =
      await import("@/modules/orders/viewModel/useCustomerOrders");
    const { result } = renderHook(() => useCustomerOrders("customer-5"), {
      wrapper: RouterWrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasOrders).toBe(false);
  });
});

describe("useDashboard", () => {
  it("собирает показатели из данных трёх модулей", async () => {
    vi.resetModules();
    const { useDashboard } =
      await import("@/modules/dashboard/viewModel/useDashboard");
    const { result } = renderHook(() => useDashboard(), {
      wrapper: RouterWrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const tiles = Object.fromEntries(
      result.current.statTiles.map(({ key, value }) => [
        key,
        normalizeSpaces(value),
      ]),
    );
    expect(tiles).toEqual({
      revenue: "3 067 980 ₽",
      orders: "30",
      customers: "16",
      lowStock: "7",
    });
    expect(result.current.ordersByMonth).toHaveLength(10);
    expect(result.current.recentOrders.map(({ number }) => number)).toEqual([
      "ORD-1030",
      "ORD-1029",
      "ORD-1028",
      "ORD-1027",
      "ORD-1026",
    ]);
  });
});
