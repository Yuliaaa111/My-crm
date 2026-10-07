import { vi } from "vitest";

// Mock tables keep their rows in module memory. Loading the modules anew
// for every test gives each test a clean "backend" built from the mocks
// and whatever the test put into localStorage beforehand.
export const loadFreshApis = async () => {
  vi.resetModules();

  const [customersApi, productsApi, ordersApi] = await Promise.all([
    import("@/modules/customers/model/customersApi"),
    import("@/modules/products/model/productsApi"),
    import("@/modules/orders/model/ordersApi"),
  ]);

  return { customersApi, productsApi, ordersApi };
};
