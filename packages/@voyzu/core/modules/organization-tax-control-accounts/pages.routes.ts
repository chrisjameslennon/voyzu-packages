import { handleListTaxControlAccounts, handlePatchTaxControlAccount } from "@voyzu/core/common/tax-control-accounts/server";
import { OrganizationTaxControlAccountsPage, OrganizationTaxControlAccountDetailPage } from "@voyzu/core/organization-tax-control-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-tax-control-accounts.page.list",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/organization-financial-settings/tax-accounts",
    path: "/organization/control-accounts/tax",
    Page: OrganizationTaxControlAccountsPage,
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  detail: {
    id: "voyzu.organization-tax-control-accounts.page.detail",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/organization-financial-settings/tax-accounts",
    path: "/organization/control-accounts/tax/[code]",
    Page: OrganizationTaxControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
      { label: "Tax Control Accounts", href: "/organization/control-accounts/tax" },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
