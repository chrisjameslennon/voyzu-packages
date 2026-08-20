import { handleGetTaxEntry, handleListTaxEntries } from "@voyzu/core/tax-ledger/server";
import { TaxLedgerEntriesListPage, TaxLedgerEntryDetailPage } from "@voyzu/core/tax-ledger/server";

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
    auth: { required: true, minRole: "COMPANY_USER" }
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
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
