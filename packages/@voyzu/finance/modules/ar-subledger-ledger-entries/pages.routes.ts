import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";
export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-ledger-entries.page.list",
    pageTitle: "AR Ledger Entries",
    helpPath: "modules-help/company-ledger/ar-ledger-entries",
    path: "/finance/subledgers/ar/ledger-entries",
    loadPage: () => import("./server/pages/ArLedgerEntriesListPage").then((module) => module.ArLedgerEntriesListPage),
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
    loadPage: () => import("./server/pages/ArLedgerEntryDetailPage").then((module) => module.ArLedgerEntryDetailPage),
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
    loadPage: () => import("./server/pages/ArLedgerEntryDetailPage").then((module) => module.ArLedgerEntryDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
