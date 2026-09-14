import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.financial-years.page.list": {
    httpApiDocumentationGroupId: "finance.financial-years",
    pageTitle: "Financial Periods",
    helpPath: "modules-help/company-ledger/financial-periods",
    path: "/finance/financial-periods",
    loadPage: () => import("./server/pages/FinancialYearsListPage").then((module) => module.FinancialYearsListPage),
    breadcrumbBase: [
      { label: "Finance" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.financial-years.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.financial-years",
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
