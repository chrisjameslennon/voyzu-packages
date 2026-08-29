export const pageRoutes = {
  list: {
    id: "voyzu.inventory.items.page.list",
    path: "/inventory/items",
    loadPage: () => import("./server/pages/ItemsListPage").then((module) => module.ItemsListPage),
    pageTitle: "Items",
    breadcrumbBase: [{ label: "Inventory" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.inventory.items.page.detail",
    path: "/inventory/items/[sku]",
    loadPage: () => import("./server/pages/ItemDetailPage").then((module) => module.ItemDetailPage),
    pageTitle: "Item",
    breadcrumbBase: [{ label: "Inventory" }, { label: "Items", href: "/inventory/items" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
