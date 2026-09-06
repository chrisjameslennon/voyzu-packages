export const pageRoutes = {
  customers: {
    id: "voyzu.commercial.customers.page.customers",
    path: "/commercial/customers",
    pageTitle: "Customers",
    loadPage: () => import("./server/pages/CustomersPage").then((module) => module.CustomersPage),
    breadcrumbBase: [{ label: "Commercial" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  customerPriceLists: {
    id: "voyzu.commercial.customers.page.customerPriceLists",
    path: "/commercial/customers/price-lists",
    pageTitle: "Customer Price Lists",
    loadPage: () => import("./server/pages/CustomerPriceListsPage").then((module) => module.CustomerPriceListsPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Customers" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
