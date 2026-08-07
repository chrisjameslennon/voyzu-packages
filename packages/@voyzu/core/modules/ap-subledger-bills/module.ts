
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ApBillsListPage, ApBillDetailPage } from "@voyzu/core/ap-subledger-bills/server";export const apSubledgerBillsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ap-subledger-bills.page.list",
          pageTitle: "AP Bills",
          helpPath: "modules-help/company-ledger/ap-bills",
          path: "/finance/subledgers/ap/bills",
          Page: ApBillsListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ap/bills" },
                { label: "Accounts Payable", href: "/finance/subledgers/ap/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ap-subledger-bills.page.detail",
          pageTitle: "AP Bill",
          helpPath: "modules-help/company-ledger/ap-bills",
          path: "/finance/subledgers/ap/bills/[documentId]",
          Page: ApBillDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ap/bills" },
                { label: "AP Bills", href: "/finance/subledgers/ap/bills" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detailPrintable: {
          id: "voyzu.ap-subledger-bills.page.detail.printable",
          pageTitle: "AP Bill",
          path: "/finance/subledgers/ap/bills/[documentId]/printable",
          Page: ApBillDetailPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },

  apiDefinitions: {},
} as const satisfies VoyzuPackageModuleDefinition;
