
export const pageRoutes = {
  list: {
    id: "voyzu.organization-ar-control-accounts.page.list",
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/organization-financial-settings/ar-control-accounts",
    path: "/finance/control-accounts/ar",
    loadPage: () => import("./server/pages/OrganizationArControlAccountsListPage").then((module) => module.OrganizationArControlAccountsListPage),
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
    id: "voyzu.organization-ar-control-accounts.page.detail",
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/organization-financial-settings/ar-control-accounts",
    path: "/finance/control-accounts/ar/[code]",
    loadPage: () => import("./server/pages/OrganizationArControlAccountDetailPage").then((module) => module.OrganizationArControlAccountDetailPage),
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
        label: "Accounts Receivable Control Accounts",
        href: "/finance/control-accounts/ar",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
