
export const pageRoutes = {
  list: {
    id: "voyzu.organization-ap-control-accounts.page.list",
    pageTitle: "Accounts Payable Control Accounts",
    helpPath: "modules-help/organization-financial-settings/ap-control-accounts",
    path: "/finance/control-accounts/ap",
    loadPage: () => import("./server/pages/OrganizationApControlAccountsListPage").then((module) => module.OrganizationApControlAccountsListPage),
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
    id: "voyzu.organization-ap-control-accounts.page.detail",
    pageTitle: "Accounts Payable Control Accounts",
    helpPath: "modules-help/organization-financial-settings/ap-control-accounts",
    path: "/finance/control-accounts/ap/[code]",
    loadPage: () => import("./server/pages/OrganizationApControlAccountDetailPage").then((module) => module.OrganizationApControlAccountDetailPage),
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
        label: "Accounts Payable Control Accounts",
        href: "/finance/control-accounts/ap",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
