import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ap-subledger-ledger-entries.page.list": {

    httpApiDocumentationGroupId: "ledger.ap-subledger-ledger-entries",
    pageTitle: "AP Ledger Entries",
    helpPath: "modules-help/company-ledger/ap-ledger-entries",
    path: "/ledger/subledgers/ap/ledger-entries",
    loadPage: () => import("./server/pages/ApLedgerEntriesListPage").then((module) => module.ApLedgerEntriesListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Subledgers" },
      { label: "AP Subledger" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ap-subledger-ledger-entries.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.ap-subledger-ledger-entries",
    pageTitle: "AP Ledger Entry",
    helpPath: "modules-help/company-ledger/ap-ledger-entries",
    path: "/ledger/subledgers/ap/ledger-entries/[code]",
    loadPage: () => import("./server/pages/ApLedgerEntryDetailPage").then((module) => module.ApLedgerEntryDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Subledgers" },
      { label: "AP Ledger Entries", href: "/ledger/subledgers/ap/ledger-entries" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ap-subledger-ledger-entries.page.detail.documentPrintable": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.ap-subledger-ledger-entries",
    pageTitle: "AP Ledger Entry",
    path: "/ledger/subledgers/ap/ledger-entries/[code]/document-printable",
    loadPage: () => import("./server/pages/ApLedgerEntryDetailPage").then((module) => module.ApLedgerEntryDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
