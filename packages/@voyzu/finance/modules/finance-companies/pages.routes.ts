
export const pageRoutes = {
  list: {
    id: "voyzu.financeCompanies.page.list",
    pageTitle: "Financial Entities",
    path: "/finance/companies",
    loadPage: () => import("./server/pages/FinanceCompaniesListPage").then((module) => module.FinanceCompaniesListPage),
    breadcrumbBase: [{ label: "Finance Admin", href: "/finance/companies" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.financeCompanies.page.detail",
    pageTitle: "Financial Entity",
    path: "/finance/companies/[code]",
    loadPage: () => import("./server/pages/FinanceCompanyDetailPage").then((module) => module.FinanceCompanyDetailPage),
    breadcrumbBase: [
      { label: "Finance Admin", href: "/finance/companies" },
      { label: "Financial Entities", href: "/finance/companies" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
