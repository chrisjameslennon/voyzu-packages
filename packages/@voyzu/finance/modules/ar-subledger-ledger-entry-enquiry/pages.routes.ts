import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-ledger-entry-enquiry.page.list",
    pageTitle: "AR Ledger Entry Enquiry",
    helpPath: "modules-help/company-ledger/ar-ledger-entry-enquiry",
    path: "/finance/subledgers/ar/ledger-entry-enquiry",
    loadPage: () => import("./server/pages/ArLedgerEntryEnquiryListPage").then((module) => module.ArLedgerEntryEnquiryListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Receivable" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.ar-subledger-ledger-entry-enquiry.page.detail",
    pageTitle: "AR Ledger Entry Enquiry",
    helpPath: "modules-help/company-ledger/ar-ledger-entry-enquiry",
    path: "/finance/subledgers/ar/ledger-entry-enquiry/[code]",
    loadPage: () => import("./server/pages/ArLedgerEntryEnquiryDetailPage").then((module) => module.ArLedgerEntryEnquiryDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Ledger Entry Enquiry", href: "/finance/subledgers/ar/ledger-entry-enquiry" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
