import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.tax-ledger.page.list": {

    httpApiDocumentationGroupId: "ledger.tax-ledger",
    pageTitle: "Tax Ledger Entries",
    helpPath: "modules-help/company-ledger/tax-ledger-entries",
    path: "/ledger/subledgers/tax/ledger-entries",
    loadPage: () => import("./server/pages/TaxLedgerEntriesListPage").then((module) => module.TaxLedgerEntriesListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Subledgers" },
      { label: "Tax Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.tax-ledger.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.tax-ledger",
    pageTitle: "Tax Ledger Entry",
    helpPath: "modules-help/company-ledger/tax-ledger-entries",
    path: "/ledger/subledgers/tax/ledger-entries/[code]",
    loadPage: () => import("./server/pages/TaxLedgerEntryDetailPage").then((module) => module.TaxLedgerEntryDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Subledgers" },
      { label: "Tax Ledger Entries", href: "/ledger/subledgers/tax/ledger-entries" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
