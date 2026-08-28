import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.ap-subledger-ledger-entry-enquiry.page.list",
    pageTitle: "AP Ledger Entry Enquiry",
    helpPath: "modules-help/company-ledger/ap-ledger-entry-enquiry",
    path: "/finance/subledgers/ap/ledger-entry-enquiry",
    loadPage: () => import("./server/pages/ApLedgerEntryEnquiryListPage").then((module) => module.ApLedgerEntryEnquiryListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Payable" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.ap-subledger-ledger-entry-enquiry.page.detail",
    pageTitle: "AP Ledger Entry Enquiry",
    helpPath: "modules-help/company-ledger/ap-ledger-entry-enquiry",
    path: "/finance/subledgers/ap/ledger-entry-enquiry/[code]",
    loadPage: () => import("./server/pages/ApLedgerEntryEnquiryDetailPage").then((module) => module.ApLedgerEntryEnquiryDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Ledger Entry Enquiry", href: "/finance/subledgers/ap/ledger-entry-enquiry" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
