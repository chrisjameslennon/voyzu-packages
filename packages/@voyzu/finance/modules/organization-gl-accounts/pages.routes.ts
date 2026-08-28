
export const pageRoutes = {
  list: {
    id: "voyzu.organization-gl-accounts.page.list",
    pageTitle: "General Ledger Accounts",
    helpPath: "modules-help/organization-financial-settings/general-ledger-accounts",
    path: "/finance/general-ledger-accounts",
    loadPage: () => import("./server/pages/OrganizationGlAccountsListPage").then((module) => module.OrganizationGlAccountsListPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organization-gl-accounts.page.detail",
    pageTitle: "General Ledger Account",
    helpPath: "modules-help/organization-financial-settings/general-ledger-accounts",
    path: "/finance/general-ledger-accounts/[code]",
    loadPage: () => import("./server/pages/OrganizationGlAccountDetailPage").then((module) => module.OrganizationGlAccountDetailPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
      {
        label: "General Ledger Accounts",
        href: "/finance/general-ledger-accounts",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
