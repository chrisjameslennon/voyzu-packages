import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-invoices.page.list",
    pageTitle: "AR Invoices",
    helpPath: "modules-help/company-ledger/ar-invoices",
    path: "/finance/subledgers/ar/invoices",
    loadPage: () => import("./server/pages/ArInvoicesListPage").then((module) => module.ArInvoicesListPage),
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
    loadPage: () => import("./server/pages/ArInvoiceDetailPage").then((module) => module.ArInvoiceDetailPage),
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
    loadPage: () => import("./server/pages/ArInvoiceDetailPage").then((module) => module.ArInvoiceDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
