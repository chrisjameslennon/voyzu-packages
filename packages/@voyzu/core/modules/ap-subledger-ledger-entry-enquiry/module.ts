
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ApLedgerEntryEnquiryListPage, ApLedgerEntryEnquiryDetailPage } from "@voyzu/core/ap-subledger-ledger-entry-enquiry/server";export const apSubledgerLedgerEntryEnquiryModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ap-subledger-ledger-entry-enquiry.page.list",
          pageTitle: "AP Ledger Entry Enquiry",
          helpPath: "modules-help/company-ledger/ap-ledger-entry-enquiry",
          path: "/finance/subledgers/ap/ledger-entry-enquiry",
          Page: ApLedgerEntryEnquiryListPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Subledgers" },
                { label: "Accounts Payable" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ap-subledger-ledger-entry-enquiry.page.detail",
          pageTitle: "AP Ledger Entry Enquiry",
          helpPath: "modules-help/company-ledger/ap-ledger-entry-enquiry",
          path: "/finance/subledgers/ap/ledger-entry-enquiry/[code]",
          Page: ApLedgerEntryEnquiryDetailPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Subledgers" },
                { label: "AP Ledger Entry Enquiry", href: "/finance/subledgers/ap/ledger-entry-enquiry" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },

  apiDefinitions: {},
} as const satisfies VoyzuPackageModuleDefinition;
