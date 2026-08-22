import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { ArInvoicesListPage, ArInvoiceDetailPage } from "@voyzu/core/ar-subledger-invoices/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-invoices.page.list",
    pageTitle: "AR Invoices",
    helpPath: "modules-help/company-ledger/ar-invoices",
    path: "/finance/subledgers/ar/invoices",
    Page: ArInvoicesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Receivable" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.ar-subledger-invoices.page.detail",
    pageTitle: "AR Invoice",
    helpPath: "modules-help/company-ledger/ar-invoices",
    path: "/finance/subledgers/ar/invoices/[documentId]",
    Page: ArInvoiceDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Invoices", href: "/finance/subledgers/ar/invoices" },
    ],
    auth: companyFinancePageAuth
  },
  detailPrintable: {
    id: "voyzu.ar-subledger-invoices.page.detail.printable",
    pageTitle: "AR Invoice",
    path: "/finance/subledgers/ar/invoices/[documentId]/printable",
    Page: ArInvoiceDetailPage,
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
