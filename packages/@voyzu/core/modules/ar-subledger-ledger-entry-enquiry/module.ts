
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ArLedgerEntryEnquiryListPage, ArLedgerEntryEnquiryDetailPage } from "@voyzu/core/ar-subledger-ledger-entry-enquiry/server";export const arSubledgerLedgerEntryEnquiryModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ar-subledger-ledger-entry-enquiry.page.list",
          pageTitle: "AR Ledger Entry Enquiry",
          helpPath: "modules-help/company-ledger/ar-ledger-entry-enquiry",
          path: "/finance/subledgers/ar/ledger-entry-enquiry",
          Page: ArLedgerEntryEnquiryListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ar/ledger-entry-enquiry" },
                { label: "Accounts Receivable", href: "/finance/subledgers/ar/ledger-entries" },
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
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ar/ledger-entry-enquiry" },
                { label: "AR Ledger Entry Enquiry", href: "/finance/subledgers/ar/ledger-entry-enquiry" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },

  apiDefinitions: {},
} as const satisfies VoyzuPackageModuleDefinition;
