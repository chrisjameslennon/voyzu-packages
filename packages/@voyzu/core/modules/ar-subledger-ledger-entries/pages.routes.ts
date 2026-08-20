import { handleGetArEntry, handleListArEntries } from "@voyzu/core/ar-subledger-ledger-entries/server";
import {
  ArLedgerEntriesListPage,
  ArLedgerEntryDetailPage,
} from "@voyzu/core/ar-subledger-ledger-entries/server";

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
    auth: { required: true, minRole: "COMPANY_USER" }
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
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detailDocumentPrintable: {
    id: "voyzu.ar-subledger-ledger-entries.page.detail.documentPrintable",
    pageTitle: "AR Ledger Entry",
    path: "/finance/subledgers/ar/ledger-entries/[code]/document-printable",
    Page: ArLedgerEntryDetailPage,
    unframed: true,
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
