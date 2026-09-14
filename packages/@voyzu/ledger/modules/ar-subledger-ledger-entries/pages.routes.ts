import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ar-subledger-ledger-entries.page.list": {

    httpApiDocumentationGroupId: "ledger.ar-subledger-ledger-entries",
    pageTitle: "AR Ledger Entries",
    helpPath: "modules-help/company-ledger/ar-ledger-entries",
    path: "/ledger/subledgers/ar/ledger-entries",
    loadPage: () => import("./server/pages/ArLedgerEntriesListPage").then((module) => module.ArLedgerEntriesListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Subledgers" },
      { label: "AR Subledger" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ar-subledger-ledger-entries.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.ar-subledger-ledger-entries",
    pageTitle: "AR Ledger Entry",
    helpPath: "modules-help/company-ledger/ar-ledger-entries",
    path: "/ledger/subledgers/ar/ledger-entries/[code]",
    loadPage: () => import("./server/pages/ArLedgerEntryDetailPage").then((module) => module.ArLedgerEntryDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Subledgers" },
      { label: "AR Ledger Entries", href: "/ledger/subledgers/ar/ledger-entries" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ar-subledger-ledger-entries.page.detail.documentPrintable": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.ar-subledger-ledger-entries",
    pageTitle: "AR Ledger Entry",
    path: "/ledger/subledgers/ar/ledger-entries/[code]/document-printable",
    loadPage: () => import("./server/pages/ArLedgerEntryDetailPage").then((module) => module.ArLedgerEntryDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
