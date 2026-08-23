import { handleGet as handleControlAccountsGet, handleListAp as handleApControlAccountsList, handlePatch as handleControlAccountsPatch } from "@voyzu/finance/common/control-accounts/server";
import { OrganizationApControlAccountsListPage, OrganizationApControlAccountDetailPage } from "@voyzu/finance/organization-ap-control-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-ap-control-accounts.page.list",
    pageTitle: "Accounts Payable Control Accounts",
    helpPath: "modules-help/organization-financial-settings/ap-control-accounts",
    path: "/finance/control-accounts/ap",
    Page: OrganizationApControlAccountsListPage,
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
    Page: OrganizationApControlAccountDetailPage,
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
