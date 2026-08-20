import { handleGetApEntry, handleListApEntries } from "@voyzu/core/ap-subledger-ledger-entries/server";
import { ApLedgerEntriesListPage, ApLedgerEntryDetailPage } from "@voyzu/core/ap-subledger-ledger-entries/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ap-subledger-ledger-entries.page.list",
    pageTitle: "AP Ledger Entries",
    helpPath: "modules-help/company-ledger/ap-ledger-entries",
    path: "/finance/subledgers/ap/ledger-entries",
    Page: ApLedgerEntriesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Subledger" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.ap-subledger-ledger-entries.page.detail",
    pageTitle: "AP Ledger Entry",
    helpPath: "modules-help/company-ledger/ap-ledger-entries",
    path: "/finance/subledgers/ap/ledger-entries/[code]",
    Page: ApLedgerEntryDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Ledger Entries", href: "/finance/subledgers/ap/ledger-entries" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detailDocumentPrintable: {
    id: "voyzu.ap-subledger-ledger-entries.page.detail.documentPrintable",
    pageTitle: "AP Ledger Entry",
    path: "/finance/subledgers/ap/ledger-entries/[code]/document-printable",
    Page: ApLedgerEntryDetailPage,
    unframed: true,
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
