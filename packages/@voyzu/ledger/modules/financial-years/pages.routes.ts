import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.financial-years.page.list": {
    httpApiDocumentationGroupId: "ledger.financial-years",
    pageTitle: "Financial Periods",
    helpPath: "modules-help/company-ledger/financial-periods",
    path: "/ledger/financial-periods",
    loadPage: () => import("./server/pages/FinancialYearsListPage").then((module) => module.FinancialYearsListPage),
    breadcrumbBase: [
      { label: "Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.financial-years.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.financial-years",
    pageTitle: "Financial Year",
    helpPath: "modules-help/company-ledger/financial-periods",
    path: "/ledger/financial-periods/[code]",
    loadPage: () => import("./server/pages/FinancialYearDetailPage").then((module) => module.FinancialYearDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Financial Periods", href: "/ledger/financial-periods" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
