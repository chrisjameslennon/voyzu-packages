
export const pageRoutes = {
  list: {
    id: "voyzu.organization-bank-cash-accounts.page.list",
    pageTitle: "Bank / Cash Accounts",
    helpPath: "modules-help/organization-financial-settings/bank-cash-accounts",
    path: "/finance/bank-cash-accounts",
    loadPage: () => import("./server/pages/OrganizationBankCashAccountsListPage").then((module) => module.OrganizationBankCashAccountsListPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Control Accounts",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organization-bank-cash-accounts.page.detail",
    pageTitle: "Bank / Cash Account",
    helpPath: "modules-help/organization-financial-settings/bank-cash-accounts",
    path: "/finance/bank-cash-accounts/[code]",
    loadPage: () => import("./server/pages/OrganizationBankCashAccountDetailPage").then((module) => module.OrganizationBankCashAccountDetailPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Control Accounts",
      },
      {
        label: "Bank / Cash Accounts",
        href: "/finance/bank-cash-accounts",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
