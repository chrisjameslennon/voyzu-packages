import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ar-subledger-ledger-entry-enquiry.page.list": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
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
  "voyzu.ar-subledger-ledger-entry-enquiry.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
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
