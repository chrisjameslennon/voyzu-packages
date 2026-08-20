import { handleGet as handleControlAccountsGet, handleListAr as handleArControlAccountsList, handlePatch as handleControlAccountsPatch } from "@voyzu/core/common/control-accounts/server";
import { OrganizationArControlAccountsListPage, OrganizationArControlAccountDetailPage } from "@voyzu/core/organization-ar-control-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-ar-control-accounts.page.list",
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/organization-financial-settings/ar-control-accounts",
    path: "/organization/control-accounts/ar",
    Page: OrganizationArControlAccountsListPage,
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
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  detail: {
    id: "voyzu.organization-ar-control-accounts.page.detail",
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/organization-financial-settings/ar-control-accounts",
    path: "/organization/control-accounts/ar/[code]",
    Page: OrganizationArControlAccountDetailPage,
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
        href: "/organization/control-accounts/ar",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
