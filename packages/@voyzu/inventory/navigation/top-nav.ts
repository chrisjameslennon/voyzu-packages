import { pageRoutes } from "../modules/items/pages.routes";

export const inventoryTopNav = {
  label: "Inventory",
  icon: "inventory_2",
  routeId: pageRoutes.list.id,
} as const;

export default inventoryTopNav;
