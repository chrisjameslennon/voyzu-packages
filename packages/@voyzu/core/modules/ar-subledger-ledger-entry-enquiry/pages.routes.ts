import { ArLedgerEntryEnquiryListPage, ArLedgerEntryEnquiryDetailPage } from "@voyzu/core/ar-subledger-ledger-entry-enquiry/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-ledger-entry-enquiry.page.list",
    pageTitle: "AR Ledger Entry Enquiry",
    helpPath: "modules-help/company-ledger/ar-ledger-entry-enquiry",
    path: "/finance/subledgers/ar/ledger-entry-enquiry",
    Page: ArLedgerEntryEnquiryListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Receivable" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.ar-subledger-ledger-entry-enquiry.page.detail",
    pageTitle: "AR Ledger Entry Enquiry",
    helpPath: "modules-help/company-ledger/ar-ledger-entry-enquiry",
    path: "/finance/subledgers/ar/ledger-entry-enquiry/[code]",
    Page: ArLedgerEntryEnquiryDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Ledger Entry Enquiry", href: "/finance/subledgers/ar/ledger-entry-enquiry" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
