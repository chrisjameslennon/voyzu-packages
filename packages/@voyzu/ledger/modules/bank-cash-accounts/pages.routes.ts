import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-bank-cash-accounts.page.list": {

    httpApiDocumentationGroupId: "ledger.bank-cash-accounts",
    pageTitle: "Bank / Cash Accounts",
    helpPath: "modules-help/company-ledger/bank-cash-accounts",
    path: "/ledger/settings/bank-cash-accounts",
    loadPage: () => import("./server/pages/BankCashAccountsListPage").then((module) => module.BankCashAccountsListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-bank-cash-accounts.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.bank-cash-accounts",
    pageTitle: "Bank / Cash Account",
    helpPath: "modules-help/company-ledger/bank-cash-accounts",
    path: "/ledger/settings/bank-cash-accounts/[code]",
    loadPage: () => import("./server/pages/BankCashAccountDetailPage").then((module) => module.BankCashAccountDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Control Accounts" },
      { label: "Bank / Cash Accounts", href: "/ledger/settings/bank-cash-accounts" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
