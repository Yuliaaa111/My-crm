import { describe, expect, it } from "vitest";

import type { CustomerRequest } from "@/modules/customers/model/types";
import { loadFreshApis } from "../../helpers/loadModules";

const newCustomer: CustomerRequest = {
  firstName: "Елена",
  lastName: "Тестова",
  email: "elena@test.ru",
  phone: "+7 999 111-22-33",
  company: "",
  city: "Ярославль",
  countryCode: "RU",
  status: "active",
};

describe("customersApi", () => {
  it("отдаёт 20 клиентов из моков", async () => {
    const { customersApi } = await loadFreshApis();

    expect(await customersApi.fetchCustomers()).toHaveLength(20);
  });

  it("создаёт клиента первым в списке, с id и датой", async () => {
    const { customersApi } = await loadFreshApis();
    const created = await customersApi.createCustomer(newCustomer);
    const customers = await customersApi.fetchCustomers();

    expect(created.id).toBeTruthy();
    expect(Date.parse(created.createdAt)).not.toBeNaN();
    expect(customers).toHaveLength(21);
    expect(customers[0]).toEqual(created);
  });

  it("изменения сохраняются между «перезагрузками»", async () => {
    const firstLoad = await loadFreshApis();
    const created = await firstLoad.customersApi.createCustomer(newCustomer);

    const secondLoad = await loadFreshApis();

    expect(await secondLoad.customersApi.fetchCustomers()).toContainEqual(
      created,
    );
  });

  it("изменяет клиента, сохраняя id и дату создания", async () => {
    const { customersApi } = await loadFreshApis();
    const [original] = await customersApi.fetchCustomers();
    const updated = await customersApi.updateCustomer(original.id, {
      ...newCustomer,
      city: "Кострома",
    });

    expect(updated).toMatchObject({
      id: original.id,
      createdAt: original.createdAt,
      city: "Кострома",
    });
    expect((await customersApi.fetchCustomers())[0].city).toBe("Кострома");
  });

  it("удаляет клиента", async () => {
    const { customersApi } = await loadFreshApis();
    await customersApi.deleteCustomer("customer-1");
    const customers = await customersApi.fetchCustomers();

    expect(customers).toHaveLength(19);
    expect(customers.some(({ id }) => id === "customer-1")).toBe(false);
  });

  it("отклоняет изменение и удаление несуществующего клиента", async () => {
    const { customersApi } = await loadFreshApis();

    await expect(
      customersApi.updateCustomer("nope", newCustomer),
    ).rejects.toThrow("Клиент не найден");
    await expect(customersApi.deleteCustomer("nope")).rejects.toThrow(
      "Клиент не найден",
    );
  });

  it("в моках у всех клиентов корректный код страны", async () => {
    const { customersApi } = await loadFreshApis();
    const codes = new Set(
      (await customersApi.fetchCustomers()).map(
        ({ countryCode }) => countryCode,
      ),
    );

    expect([...codes].sort()).toEqual(["BY", "KZ", "RU"]);
  });
});
