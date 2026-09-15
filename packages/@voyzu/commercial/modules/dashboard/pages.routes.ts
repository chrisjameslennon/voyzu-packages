export const pageRoutes = {
  "voyzu.commercial.dashboard.page.dashboard": {
    path: "/commercial",
    pageTitle: "Dashboard",
    breadcrumbBase: [{ label: "Commercial" }],
    auth: { required: true, minRole: "STANDARD" },
    loadPage: () => import("./server/pages/DashboardPage").then((module) => module.DashboardPage),
  },
} as const;
