import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  transactions: {
    id: "voyzu.ar-integration-processing.page.transactions",
    pageTitle: "Accounts Receivable Transactions",
    path: "/finance/integration/accounts-receivable/transactions",
    loadPage: () => import("./server/pages/ArIntegrationTransactionsPage").then((module) => module.ArIntegrationTransactionsPage),
    breadcrumbBase: [{ label: "Finance" }, { label: "Integration" }, { label: "Accounts Receivable" }],
    auth: companyFinancePageAuth,
  },
} as const;
