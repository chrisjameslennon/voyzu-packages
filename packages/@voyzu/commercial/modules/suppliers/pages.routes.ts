export const pageRoutes = {
  suppliers: {
    id: "voyzu.commercial.suppliers.page.suppliers",
    path: "/commercial/suppliers",
    pageTitle: "Suppliers",
    loadPage: () => import("./server/pages/SuppliersPage").then((module) => module.SuppliersPage),
    breadcrumbBase: [{ label: "Commercial" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
