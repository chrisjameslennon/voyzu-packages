import type { PageHelpContext } from "@voyzu/types/page-routing";
import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-financial-document-types.page.list": {

    httpApiDocumentationGroupId: "ledger.financial-document-types",
    pageTitle: "Financial Document Types",
    helpPath: "modules-help/company-ledger/financial-document-types",
    path: "/ledger/integration/financial-document-types",
    loadPage: () => import("./server/pages/FinancialDocumentTypesListPage").then((module) => module.FinancialDocumentTypesListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Integration" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-financial-document-types.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.financial-document-types",
    pageTitle: "Financial Document Type",
    helpPathResolver: ({ pathParams }: PageHelpContext) =>
      `help-core/financial-documents/${String(pathParams.code).toLowerCase()}`,
    path: "/ledger/integration/financial-document-types/[code]",
    loadPage: () => import("./server/pages/FinancialDocumentTypeDetailPage").then((module) => module.FinancialDocumentTypeDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Types", href: "/ledger/integration/financial-document-types" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
