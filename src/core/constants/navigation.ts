import {
  LayoutDashboard,
  type LucideIcon,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import { ROUTES } from "./routes";

export type NavigationItemType = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const NAVIGATION_ITEMS: NavigationItemType[] = [
  { label: "Сводка", path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Клиенты", path: ROUTES.customers, icon: Users },
  { label: "Товары", path: ROUTES.products, icon: Package },
  { label: "Заказы", path: ROUTES.orders, icon: ShoppingCart },
];
