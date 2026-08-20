import { handleActivate as handleGlAccountsActivate, handleBatchCreate as handleGlAccountsBatchCreate, handleBatchActivate as handleGlAccountsBatchActivate, handleBatchDeactivate as handleGlAccountsBatchDeactivate, handleBatchDelete as handleGlAccountsBatchDelete, handleBatchGet as handleGlAccountsBatchGet, handleBatchPatch as handleGlAccountsBatchPatch, handleBatchUpdate as handleGlAccountsBatchUpdate, handleCreate as handleGlAccountsCreate, handleDeactivate as handleGlAccountsDeactivate, handleDelete as handleGlAccountsDelete, handleFilter as handleGlAccountsFilter, handleGet as handleGlAccountsGet, handleList as handleGlAccountsList, handlePatch as handleGlAccountsPatch, handleSearch as handleGlAccountsSearch, handleUpdate as handleGlAccountsUpdate } from "@voyzu/core/common/gl-accounts/server";
import { OrganizationGlAccountsListPage, OrganizationGlAccountDetailPage } from "./server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-gl-accounts.page.list",
    pageTitle: "General Ledger Accounts",
    helpPath: "modules-help/organization-financial-settings/general-ledger-accounts",
    path: "/organization/general-ledger-accounts",
    Page: OrganizationGlAccountsListPage,
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
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  detail: {
    id: "voyzu.organization-gl-accounts.page.detail",
    pageTitle: "General Ledger Account",
    helpPath: "modules-help/organization-financial-settings/general-ledger-accounts",
    path: "/organization/general-ledger-accounts/[code]",
    Page: OrganizationGlAccountDetailPage,
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
        href: "/organization/general-ledger-accounts",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
