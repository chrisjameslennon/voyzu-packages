
export const pageRoutes = {
  list: {
    id: "voyzu.organization-tax-control-accounts.page.list",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/organization-financial-settings/tax-accounts",
    path: "/finance/control-accounts/tax",
    loadPage: () => import("./server/pages/OrganizationTaxControlAccountsPage").then((module) => module.OrganizationTaxControlAccountsPage),
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
    ],
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organization-tax-control-accounts.page.detail",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/organization-financial-settings/tax-accounts",
    path: "/finance/control-accounts/tax/[code]",
    loadPage: () => import("./server/pages/OrganizationTaxControlAccountDetailPage").then((module) => module.OrganizationTaxControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
      { label: "Tax Control Accounts", href: "/finance/control-accounts/tax" },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
