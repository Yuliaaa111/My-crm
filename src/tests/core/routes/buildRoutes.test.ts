import type { ComponentType } from "react";
import type { RouteObject } from "react-router-dom";
import { describe, expect, it } from "vitest";

import {
  buildRoutes,
  getDirectorySegments,
  toRoutePath,
} from "@/core/routes/buildRoutes";

const Stub: ComponentType = () => null;
const loadStub = () => Promise.resolve(Stub);

const findChild = (
  route: RouteObject,
  predicate: (child: RouteObject) => boolean,
): RouteObject | undefined => route.children?.find(predicate);

describe("toRoutePath", () => {
  it("обычная папка — сегмент URL", () => {
    expect(toRoutePath("customers")).toBe("customers");
  });

  it("папка в квадратных скобках — параметр", () => {
    expect(toRoutePath("[customerId]")).toBe(":customerId");
  });

  it("группа в круглых скобках и корень не попадают в URL", () => {
    expect(toRoutePath("(protected)")).toBeUndefined();
    expect(toRoutePath("")).toBeUndefined();
  });
});

describe("getDirectorySegments", () => {
  it("берёт папки между ./ и именем файла", () => {
    expect(
      getDirectorySegments("./(protected)/customers/[customerId]/page.tsx"),
    ).toEqual(["(protected)", "customers", "[customerId]"]);
    expect(getDirectorySegments("./layout.tsx")).toEqual([]);
  });
});

describe("buildRoutes", () => {
  const [rootRoute] = buildRoutes({
    pageLoaders: {
      "./(auth)/login/page.tsx": loadStub,
      "./(protected)/page.tsx": loadStub,
      "./(protected)/customers/[customerId]/page.tsx": loadStub,
    },
    layouts: {
      "./layout.tsx": Stub,
      "./(protected)/layout.tsx": Stub,
    },
    NotFound: Stub,
    PageFallback: Stub,
  });

  it("корень — раскладка без пути с HydrateFallback", () => {
    expect(rootRoute.path).toBeUndefined();
    expect(rootRoute.Component).toBe(Stub);
    expect(rootRoute.HydrateFallback).toBe(Stub);
  });

  it("группа (protected) — раскладка без пути, страница — ленивый index", () => {
    const protectedRoute = findChild(
      rootRoute,
      (child) => child.Component === Stub && child.path === undefined,
    );
    const indexRoute = protectedRoute
      ? findChild(protectedRoute, (child) => child.index === true)
      : undefined;

    expect(protectedRoute).toBeDefined();
    expect(indexRoute?.lazy).toBeDefined();
    expect(indexRoute?.Component).toBeUndefined();
  });

  it("вложенные папки и параметр складываются в customers → :customerId", () => {
    const protectedRoute = findChild(
      rootRoute,
      (child) => child.Component === Stub && child.path === undefined,
    );
    const customersRoute = protectedRoute
      ? findChild(protectedRoute, (child) => child.path === "customers")
      : undefined;

    expect(
      customersRoute
        ? findChild(customersRoute, (child) => child.path === ":customerId")
        : undefined,
    ).toBeDefined();
  });

  it("группа без раскладки всё равно не меняет URL", () => {
    const authRoute = findChild(
      rootRoute,
      (child) => child.Component === undefined && child.path === undefined,
    );

    expect(
      authRoute
        ? findChild(authRoute, (child) => child.path === "login")
        : undefined,
    ).toBeDefined();
  });

  it("последний маршрут корня — страница «не найдено» для любого адреса", () => {
    expect(rootRoute.children?.at(-1)).toEqual({ path: "*", Component: Stub });
  });
});
