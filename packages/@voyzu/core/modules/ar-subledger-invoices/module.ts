
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ArInvoicesListPage, ArInvoiceDetailPage } from "@voyzu/core/ar-subledger-invoices/server";export const arSubledgerInvoicesModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ar-subledger-invoices.page.list",
          pageTitle: "AR Invoices",
          helpPath: "modules-help/company-ledger/ar-invoices",
          path: "/finance/subledgers/ar/invoices",
          Page: ArInvoicesListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ar/invoices" },
                { label: "Accounts Receivable", href: "/finance/subledgers/ar/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ar-subledger-invoices.page.detail",
          pageTitle: "AR Invoice",
          helpPath: "modules-help/company-ledger/ar-invoices",
          path: "/finance/subledgers/ar/invoices/[documentId]",
          Page: ArInvoiceDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ar/invoices" },
                { label: "AR Invoices", href: "/finance/subledgers/ar/invoices" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detailPrintable: {
          id: "voyzu.ar-subledger-invoices.page.detail.printable",
          pageTitle: "AR Invoice",
          path: "/finance/subledgers/ar/invoices/[documentId]/printable",
          Page: ArInvoiceDetailPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },

  apiDefinitions: {},
} as const satisfies VoyzuPackageModuleDefinition;
