import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-bank-cash-accounts.page.list",
    pageTitle: "Bank / Cash Accounts",
    helpPath: "modules-help/company-ledger/bank-cash-accounts",
    path: "/finance/settings/bank-cash-accounts",
    loadPage: () => import("./server/pages/CompanyBankCashAccountsListPage").then((module) => module.CompanyBankCashAccountsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-bank-cash-accounts.page.detail",
    pageTitle: "Bank / Cash Account",
    helpPath: "modules-help/company-ledger/bank-cash-accounts",
    path: "/finance/settings/bank-cash-accounts/[code]",
    loadPage: () => import("./server/pages/CompanyBankCashAccountDetailPage").then((module) => module.CompanyBankCashAccountDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
      { label: "Bank / Cash Accounts", href: "/finance/settings/bank-cash-accounts" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
