import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ap-subledger-ledger-entry-enquiry.page.list": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pageTitle: "AP Ledger Entry Enquiry",
    helpPath: "modules-help/company-ledger/ap-ledger-entry-enquiry",
    path: "/ledger/subledgers/ap/ledger-entry-enquiry",
    loadPage: () => import("./server/pages/ApLedgerEntryEnquiryListPage").then((module) => module.ApLedgerEntryEnquiryListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Subledgers" },
      { label: "Accounts Payable" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ap-subledger-ledger-entry-enquiry.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    pageTitle: "AP Ledger Entry Enquiry",
    helpPath: "modules-help/company-ledger/ap-ledger-entry-enquiry",
    path: "/ledger/subledgers/ap/ledger-entry-enquiry/[code]",
    loadPage: () => import("./server/pages/ApLedgerEntryEnquiryDetailPage").then((module) => module.ApLedgerEntryEnquiryDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Subledgers" },
      { label: "AP Ledger Entry Enquiry", href: "/ledger/subledgers/ap/ledger-entry-enquiry" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
