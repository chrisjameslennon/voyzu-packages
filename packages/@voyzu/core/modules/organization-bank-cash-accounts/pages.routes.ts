import { handleActivate as handleBankCashAccountsActivate, handleBatchActivate as handleBankCashAccountsBatchActivate, handleBatchCreate as handleBankCashAccountsBatchCreate, handleBatchDeactivate as handleBankCashAccountsBatchDeactivate, handleBatchDelete as handleBankCashAccountsBatchDelete, handleBatchGet as handleBankCashAccountsBatchGet, handleBatchPatch as handleBankCashAccountsBatchPatch, handleBatchUpdate as handleBankCashAccountsBatchUpdate, handleCreate as handleBankCashAccountsCreate, handleDeactivate as handleBankCashAccountsDeactivate, handleDelete as handleBankCashAccountsDelete, handleFilter as handleBankCashAccountsFilter, handleGet as handleBankCashAccountsGet, handleList as handleBankCashAccountsList, handlePatch as handleBankCashAccountsPatch, handleSearch as handleBankCashAccountsSearch, handleUpdate as handleBankCashAccountsUpdate } from "@voyzu/core/common/bank-cash-accounts/server";
import { OrganizationBankCashAccountsListPage, OrganizationBankCashAccountDetailPage } from "@voyzu/core/organization-bank-cash-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-bank-cash-accounts.page.list",
    pageTitle: "Bank / Cash Accounts",
    helpPath: "modules-help/organization-financial-settings/bank-cash-accounts",
    path: "/organization/bank-cash-accounts",
    Page: OrganizationBankCashAccountsListPage,
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
    id: "voyzu.organization-bank-cash-accounts.page.detail",
    pageTitle: "Bank / Cash Account",
    helpPath: "modules-help/organization-financial-settings/bank-cash-accounts",
    path: "/organization/bank-cash-accounts/[code]",
    Page: OrganizationBankCashAccountDetailPage,
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
        href: "/organization/bank-cash-accounts",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
