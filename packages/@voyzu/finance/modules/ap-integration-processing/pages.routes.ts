import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  transactions: {
    id: "voyzu.ap-integration-processing.page.transactions",
    pageTitle: "Accounts Payable Transactions",
    path: "/finance/integration/accounts-payable/transactions",
    loadPage: () => import("./server/pages/ApIntegrationTransactionsPage").then((module) => module.ApIntegrationTransactionsPage),
    breadcrumbBase: [{ label: "Finance" }, { label: "Integration" }, { label: "Accounts Payable" }],
    auth: companyFinancePageAuth,
  },
} as const;
