export const pageRoutes = {
  "voyzu.inventory.items.page.list": {

    httpApiDocumentationGroupId: "inventory.items",
    path: "/inventory/items",
    loadPage: () => import("./server/pages/ItemsListPage").then((module) => module.ItemsListPage),
    pageTitle: "Items",
    breadcrumbBase: [{ label: "Inventory" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.inventory.items.page.detail": {
    pathParams: { sku: { type: "string" } },
    httpApiDocumentationGroupId: "inventory.items",
    path: "/inventory/items/[sku]",
    loadPage: () => import("./server/pages/ItemDetailPage").then((module) => module.ItemDetailPage),
    pageTitle: "Item",
    breadcrumbBase: [{ label: "Inventory" }, { label: "Items", href: "/inventory/items" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
