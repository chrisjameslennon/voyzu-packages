const auth = { required: true, minRole: "STANDARD" } as const;
export const pageRoutes = {
  list: {
    id: "voyzu.inventory.financial-activity.page.list",
    path: "/inventory/financial-activity",
    loadPage: () => import("./server/pages/FinancialActivityPages").then((module) => module.FinancialActivityListPage),
    pageTitle: "Financial Activity",
    breadcrumbBase: [{ label: "Inventory" }],
    auth,
  },
  detail: {
    id: "voyzu.inventory.financial-activity.page.detail",
    path: "/inventory/financial-activity/[id]",
    loadPage: () => import("./server/pages/FinancialActivityPages").then((module) => module.FinancialActivityDetailPage),
    pageTitle: "Financial Activity",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Financial Activity", href: "/inventory/financial-activity" },
    ],
    auth,
  },
} as const;
