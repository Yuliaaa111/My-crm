import { beforeEach, describe, expect, it } from "vitest";

import { useCustomersStore } from "@/modules/customers/model/customersStore";
import { MOCK_CUSTOMERS } from "@/modules/customers/model/mocks";

describe("customersStore", () => {
  beforeEach(() => {
    useCustomersStore.setState(useCustomersStore.getInitialState(), true);
  });

  it("проходит статусы загрузки: idle → loading → success", () => {
    const store = useCustomersStore.getState();
    expect(store.loadStatus).toBe("idle");

    store.startLoading();
    expect(useCustomersStore.getState().loadStatus).toBe("loading");

    store.setCustomers(MOCK_CUSTOMERS);
    expect(useCustomersStore.getState()).toMatchObject({
      loadStatus: "success",
      customers: MOCK_CUSTOMERS,
    });
  });

  it("запоминает ошибку загрузки", () => {
    useCustomersStore.getState().setLoadError("Сеть недоступна");

    expect(useCustomersStore.getState()).toMatchObject({
      loadStatus: "error",
      loadErrorMessage: "Сеть недоступна",
    });
  });

  it("saveCustomer заменяет существующего и добавляет нового в начало", () => {
    const store = useCustomersStore.getState();
    store.setCustomers(MOCK_CUSTOMERS.slice(0, 2));

    store.saveCustomer({ ...MOCK_CUSTOMERS[1], city: "Кострома" });
    store.saveCustomer(MOCK_CUSTOMERS[5]);

    const cities = useCustomersStore
      .getState()
      .customers.map(({ city }) => city);
    expect(cities).toEqual([
      MOCK_CUSTOMERS[5].city,
      MOCK_CUSTOMERS[0].city,
      "Кострома",
    ]);
  });

  it("removeCustomer удаляет по id", () => {
    const store = useCustomersStore.getState();
    store.setCustomers(MOCK_CUSTOMERS.slice(0, 3));

    store.removeCustomer(MOCK_CUSTOMERS[1].id);

    expect(useCustomersStore.getState().customers.map(({ id }) => id)).toEqual([
      MOCK_CUSTOMERS[0].id,
      MOCK_CUSTOMERS[2].id,
    ]);
  });
});
