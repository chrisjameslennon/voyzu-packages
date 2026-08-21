import { handleListInventoryControlAccounts, handlePatchInventoryControlAccount } from "@voyzu/core/common/inventory-control-accounts/server";
import { OrganizationInventoryControlAccountsPage, OrganizationInventoryControlAccountDetailPage } from "@voyzu/core/organization-inventory-control-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-inventory-control-accounts.page.list",
    pageTitle: "Inventory Control Accounts",
    helpPath: "modules-help/organization-financial-settings/inventory-control-accounts",
    path: "/finance/control-accounts/inventory",
    Page: OrganizationInventoryControlAccountsPage,
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  detail: {
    id: "voyzu.organization-inventory-control-accounts.page.detail",
    pageTitle: "Inventory Control Accounts",
    helpPath: "modules-help/organization-financial-settings/inventory-control-accounts",
    path: "/finance/control-accounts/inventory/[code]",
    Page: OrganizationInventoryControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
      { label: "Inventory Control Accounts", href: "/finance/control-accounts/inventory" },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
