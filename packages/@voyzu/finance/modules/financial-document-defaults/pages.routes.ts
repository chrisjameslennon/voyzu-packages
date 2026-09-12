import { companyFinancePageAuth } from "../finance-companies/server/lib/company-finance-page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-financial-document-defaults.page.list",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/company-ledger/financial-document-defaults",
    path: "/finance/integration/financial-document-defaults",
    loadPage: () => import("./server/pages/FinancialDocumentDefaultsListPage").then((module) => module.FinancialDocumentDefaultsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-financial-document-defaults.page.detail",
    pageTitle: "Financial Document Default",
    helpPath: "modules-help/company-ledger/financial-document-defaults",
    path: "/finance/integration/financial-document-defaults/[code]",
    loadPage: () => import("./server/pages/FinancialDocumentDefaultDetailPage").then((module) => module.FinancialDocumentDefaultDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Defaults", href: "/finance/integration/financial-document-defaults" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
