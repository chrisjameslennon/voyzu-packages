import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.financial-years.page.list",
    pageTitle: "Financial Periods",
    helpPath: "modules-help/company-ledger/financial-periods",
    path: "/finance/financial-periods",
    loadPage: () => import("./server/pages/FinancialYearsListPage").then((module) => module.FinancialYearsListPage),
    breadcrumbBase: [
      { label: "Finance" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.financial-years.page.detail",
    pageTitle: "Financial Year",
    helpPath: "modules-help/company-ledger/financial-periods",
    path: "/finance/financial-periods/[code]",
    loadPage: () => import("./server/pages/FinancialYearDetailPage").then((module) => module.FinancialYearDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Financial Periods", href: "/finance/financial-periods" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
