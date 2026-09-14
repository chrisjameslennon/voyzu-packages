export const pageRoutes = {
  "voyzu.commercial.sales.page.quotes": {
    path: "/commercial/sales/quotes",
    pageTitle: "Quotes",
    loadPage: () => import("./server/pages/QuotesPage").then((module) => module.QuotesPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Sales" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.commercial.sales.page.salesOrders": {
    path: "/commercial/sales/orders",
    pageTitle: "Sales Orders",
    loadPage: () => import("./server/pages/SalesOrdersPage").then((module) => module.SalesOrdersPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Sales" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
