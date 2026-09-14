import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  "voyzu.ar-integration-processing.page.transactions": {
    pageTitle: "Accounts Receivable Transactions",
    path: "/ledger/integration/accounts-receivable/transactions",
    loadPage: () => import("./server/pages/ArIntegrationTransactionsPage").then((module) => module.ArIntegrationTransactionsPage),
    breadcrumbBase: [{ label: "Ledger" }, { label: "Integration" }, { label: "Accounts Receivable" }],
    auth: companyFinancePageAuth,
  },
} as const;
