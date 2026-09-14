import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-financial-document-defaults.page.list": {

    httpApiDocumentationGroupId: "ledger.financial-document-defaults",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/company-ledger/financial-document-defaults",
    path: "/ledger/integration/financial-document-defaults",
    loadPage: () => import("./server/pages/FinancialDocumentDefaultsListPage").then((module) => module.FinancialDocumentDefaultsListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Integration" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-financial-document-defaults.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.financial-document-defaults",
    pageTitle: "Financial Document Default",
    helpPath: "modules-help/company-ledger/financial-document-defaults",
    path: "/ledger/integration/financial-document-defaults/[code]",
    loadPage: () => import("./server/pages/FinancialDocumentDefaultDetailPage").then((module) => module.FinancialDocumentDefaultDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Defaults", href: "/ledger/integration/financial-document-defaults" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
