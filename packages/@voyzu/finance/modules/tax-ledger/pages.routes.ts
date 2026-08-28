import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.tax-ledger.page.list",
    pageTitle: "Tax Ledger Entries",
    helpPath: "modules-help/company-ledger/tax-ledger-entries",
    path: "/finance/subledgers/tax/ledger-entries",
    loadPage: () => import("./server/pages/TaxLedgerEntriesListPage").then((module) => module.TaxLedgerEntriesListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Tax Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.tax-ledger.page.detail",
    pageTitle: "Tax Ledger Entry",
    helpPath: "modules-help/company-ledger/tax-ledger-entries",
    path: "/finance/subledgers/tax/ledger-entries/[code]",
    loadPage: () => import("./server/pages/TaxLedgerEntryDetailPage").then((module) => module.TaxLedgerEntryDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Tax Ledger Entries", href: "/finance/subledgers/tax/ledger-entries" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
