import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-financial-document-types.page.list",
    pageTitle: "Financial Document Types",
    helpPath: "modules-help/company-ledger/financial-document-types",
    path: "/finance/integration/financial-document-types",
    loadPage: () => import("./server/pages/CompanyFinancialDocumentTypesListPage").then((module) => module.CompanyFinancialDocumentTypesListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-financial-document-types.page.detail",
    pageTitle: "Financial Document Type",
    helpPathResolver: ({ params }: { params: Readonly<Record<string, string>> }) =>
      `help-core/financial-documents/${params.code.toLowerCase()}`,
    path: "/finance/integration/financial-document-types/[code]",
    loadPage: () => import("./server/pages/CompanyFinancialDocumentTypeDetailPage").then((module) => module.CompanyFinancialDocumentTypeDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Types", href: "/finance/integration/financial-document-types" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
