export const pageRoutes = {
  "voyzu.commercial.customers.page.customers": {
    path: "/commercial/customers",
    pageTitle: "Customers",
    loadPage: () => import("./server/pages/CustomersPage").then((module) => module.CustomersPage),
    breadcrumbBase: [{ label: "Commercial" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.commercial.customers.page.customerPriceLists": {
    path: "/commercial/customers/price-lists",
    pageTitle: "Customer Price Lists",
    loadPage: () => import("./server/pages/CustomerPriceListsPage").then((module) => module.CustomerPriceListsPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Customers" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.commercial.customers.page.customerDetail": {
    path: "/commercial/customers/[code]", pathParams: { code: { type: "string" } }, pageTitle: "Customer",
    loadPage: () => import("./server/pages/CustomerDetailPage").then((module) => module.CustomerDetailPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Customers", href: "/commercial/customers" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.commercial.customers.page.customerCategories": {
    path: "/commercial/customers/customer-categories", pageTitle: "Customer Categories",
    loadPage: () => import("./server/pages/CustomerConfigurationPages").then((m) => m.CustomerCategoriesPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Customers", href: "/commercial/customers" }], auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.commercial.customers.page.customerCategoryDetail": {
    path: "/commercial/customers/customer-categories/[code]", pathParams: { code: { type: "string" } }, pageTitle: "Customer Category",
    loadPage: () => import("./server/pages/CustomerConfigurationPages").then((m) => m.CustomerCategoryDetailPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Customers", href: "/commercial/customers" }, { label: "Customer Categories", href: "/commercial/customers/customer-categories" }], auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.commercial.customers.page.customerPriceListDetail": {
    path: "/commercial/customers/price-lists/[code]", pathParams: { code: { type: "string" } }, pageTitle: "Customer Price List",
    loadPage: () => import("./server/pages/CustomerConfigurationPages").then((m) => m.CustomerPriceListDetailPage),
    breadcrumbBase: [{ label: "Commercial" }, { label: "Customers", href: "/commercial/customers" }, { label: "Customer Price Lists", href: "/commercial/customers/price-lists" }], auth: { required: true, minRole: "STANDARD" },
  },
} as const;
