export const pageRoutes = {
  list: {
    id: "voyzu.inventory.items.page.list",
    path: "/inventory/items",
    loadPage: () => import("./server/pages/ItemsListPage").then((module) => module.ItemsListPage),
    pageTitle: "Items",
    breadcrumbBase: [{ label: "Inventory", href: "/inventory/items" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
