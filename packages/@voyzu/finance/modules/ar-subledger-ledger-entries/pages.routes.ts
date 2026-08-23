import { companyFinancePageAuth } from "@voyzu/finance/common/server";
import { handleGetArEntry, handleListArEntries } from "@voyzu/finance/ar-subledger-ledger-entries/server";
import {
  ArLedgerEntriesListPage,
  ArLedgerEntryDetailPage,
} from "@voyzu/finance/ar-subledger-ledger-entries/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-ledger-entries.page.list",
    pageTitle: "AR Ledger Entries",
    helpPath: "modules-help/company-ledger/ar-ledger-entries",
    path: "/finance/subledgers/ar/ledger-entries",
    Page: ArLedgerEntriesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Subledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.ar-subledger-ledger-entries.page.detail",
    pageTitle: "AR Ledger Entry",
    helpPath: "modules-help/company-ledger/ar-ledger-entries",
    path: "/finance/subledgers/ar/ledger-entries/[code]",
    Page: ArLedgerEntryDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Ledger Entries", href: "/finance/subledgers/ar/ledger-entries" },
    ],
    auth: companyFinancePageAuth
  },
  detailDocumentPrintable: {
    id: "voyzu.ar-subledger-ledger-entries.page.detail.documentPrintable",
    pageTitle: "AR Ledger Entry",
    path: "/finance/subledgers/ar/ledger-entries/[code]/document-printable",
    Page: ArLedgerEntryDetailPage,
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
