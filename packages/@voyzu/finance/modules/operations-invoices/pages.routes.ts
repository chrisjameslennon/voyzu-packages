import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  create: {
    id: "voyzu.operations-invoices.page.create",
    pageTitle: "New Invoice",
    path: "/finance/operations/accounts-receivable/invoices/new",
    loadPage: () => import("./server/pages/NewInvoicePage").then((module) => module.NewInvoicePage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Operations" },
      { label: "Accounts Receivable" },
      { label: "Invoices", href: "/finance/operations/accounts-receivable/invoices" },
    ],
    auth: companyFinancePageAuth,
  },
  list: {
    id: "voyzu.operations-invoices.page.list",
    pageTitle: "Invoices",
    path: "/finance/operations/accounts-receivable/invoices",
    loadPage: () => import("./server/pages/OperationsInvoicesListPage").then((module) => module.OperationsInvoicesListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Operations" },
      { label: "Accounts Receivable" },
    ],
    auth: companyFinancePageAuth,
  },
} as const;
