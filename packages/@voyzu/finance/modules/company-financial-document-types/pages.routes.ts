import { companyFinancePageAuth } from "@voyzu/finance/common/server";
import { handleBatchGet as handleFinancialDocumentTypeBatchGet, handleFilter as handleFinancialDocumentTypeFilter, handleGet as handleFinancialDocumentTypeGet, handleList as handleFinancialDocumentTypeList, handleSearch as handleFinancialDocumentTypeSearch } from "@voyzu/finance/common/financial-document-types/server";
import { CompanyFinancialDocumentTypesListPage, CompanyFinancialDocumentTypeDetailPage } from "@voyzu/finance/company-financial-document-types/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-financial-document-types.page.list",
    pageTitle: "Financial Document Types",
    helpPath: "modules-help/company-ledger/financial-document-types",
    path: "/finance/integration/financial-document-types",
    Page: () => CompanyFinancialDocumentTypesListPage(),
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
    Page: CompanyFinancialDocumentTypeDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Types", href: "/finance/integration/financial-document-types" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
