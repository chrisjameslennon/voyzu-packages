import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { handleActivate as handleActivateGlAccount, handleBatchCreate as handleBatchCreateGlAccounts, handleBatchActivate as handleBatchActivateGlAccounts, handleBatchDeactivate as handleBatchDeactivateGlAccounts, handleBatchDelete as handleBatchDeleteGlAccounts, handleBatchGet as handleBatchGetGlAccounts, handleBatchPatch as handleBatchPatchGlAccounts, handleBatchUpdate as handleBatchUpdateGlAccounts, handleCreate as handleCreateGlAccount, handleDeactivate as handleDeactivateGlAccount, handleDelete as handleDeleteGlAccount, handleFilter as handleFilterGlAccounts, handleGet as handleGetGlAccount, handleList as handleListGlAccounts, handlePatch as handlePatchGlAccount, handleSearch as handleSearchGlAccounts, handleUpdate as handleUpdateGlAccount } from "@voyzu/core/common/gl-accounts/server";
import { CompanyGlAccountsListPage, CompanyGlAccountDetailPage } from "./server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-gl-accounts.page.list",
    pageTitle: "General Ledger Accounts",
    helpPath: "modules-help/company-ledger/gl-accounts",
    path: "/finance/settings/gl-accounts",
    Page: CompanyGlAccountsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-gl-accounts.page.detail",
    pageTitle: "General Ledger Account",
    helpPath: "modules-help/company-ledger/gl-accounts",
    path: "/finance/settings/gl-accounts/[code]",
    Page: CompanyGlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "General Ledger" },
      { label: "General Ledger Accounts", href: "/finance/settings/gl-accounts" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
