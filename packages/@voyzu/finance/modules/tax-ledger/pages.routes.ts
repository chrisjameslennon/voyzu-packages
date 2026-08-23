import { companyFinancePageAuth } from "@voyzu/finance/common/server";
import { handleGetTaxEntry, handleListTaxEntries } from "@voyzu/finance/tax-ledger/server";
import { TaxLedgerEntriesListPage, TaxLedgerEntryDetailPage } from "@voyzu/finance/tax-ledger/server";

export const pageRoutes = {
  list: {
    id: "voyzu.tax-ledger.page.list",
    pageTitle: "Tax Ledger Entries",
    helpPath: "modules-help/company-ledger/tax-ledger-entries",
    path: "/finance/subledgers/tax/ledger-entries",
    Page: TaxLedgerEntriesListPage,
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
    Page: TaxLedgerEntryDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Tax Ledger Entries", href: "/finance/subledgers/tax/ledger-entries" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
