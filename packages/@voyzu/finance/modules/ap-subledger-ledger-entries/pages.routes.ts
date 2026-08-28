import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.ap-subledger-ledger-entries.page.list",
    pageTitle: "AP Ledger Entries",
    helpPath: "modules-help/company-ledger/ap-ledger-entries",
    path: "/finance/subledgers/ap/ledger-entries",
    loadPage: () => import("./server/pages/ApLedgerEntriesListPage").then((module) => module.ApLedgerEntriesListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Subledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.ap-subledger-ledger-entries.page.detail",
    pageTitle: "AP Ledger Entry",
    helpPath: "modules-help/company-ledger/ap-ledger-entries",
    path: "/finance/subledgers/ap/ledger-entries/[code]",
    loadPage: () => import("./server/pages/ApLedgerEntryDetailPage").then((module) => module.ApLedgerEntryDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Ledger Entries", href: "/finance/subledgers/ap/ledger-entries" },
    ],
    auth: companyFinancePageAuth
  },
  detailDocumentPrintable: {
    id: "voyzu.ap-subledger-ledger-entries.page.detail.documentPrintable",
    pageTitle: "AP Ledger Entry",
    path: "/finance/subledgers/ap/ledger-entries/[code]/document-printable",
    loadPage: () => import("./server/pages/ApLedgerEntryDetailPage").then((module) => module.ApLedgerEntryDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
