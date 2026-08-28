import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-financial-document-defaults.page.list",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/company-ledger/financial-document-defaults",
    path: "/finance/integration/financial-document-defaults",
    loadPage: () => import("./server/pages/CompanyFinancialDocumentDefaultsListPage").then((module) => module.CompanyFinancialDocumentDefaultsListPage),
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
    loadPage: () => import("./server/pages/CompanyFinancialDocumentDefaultDetailPage").then((module) => module.CompanyFinancialDocumentDefaultDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Defaults", href: "/finance/integration/financial-document-defaults" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
