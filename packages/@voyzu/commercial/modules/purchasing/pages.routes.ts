export const pageRoutes = {
  purchaseOrders: {
    id: "voyzu.commercial.purchasing.page.purchaseOrders",
    path: "/commercial/purchasing/orders",
    pageTitle: "Purchase Orders",
    loadPage: () => import("./server/pages/PurchaseOrdersPage").then((module) => module.PurchaseOrdersPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Purchasing" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
