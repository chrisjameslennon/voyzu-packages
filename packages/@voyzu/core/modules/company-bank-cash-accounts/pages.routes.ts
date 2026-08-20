import { handleActivate as handleActivateBankCashAccount, handleBatchActivate as handleBatchActivateBankCashAccounts, handleBatchCreate as handleBatchCreateBankCashAccounts, handleBatchDeactivate as handleBatchDeactivateBankCashAccounts, handleBatchDelete as handleBatchDeleteBankCashAccounts, handleBatchGet as handleBatchGetBankCashAccounts, handleBatchPatch as handleBatchPatchBankCashAccounts, handleBatchUpdate as handleBatchUpdateBankCashAccounts, handleCreate as handleCreateBankCashAccount, handleDeactivate as handleDeactivateBankCashAccount, handleDelete as handleDeleteBankCashAccount, handleFilter as handleFilterBankCashAccounts, handleGet as handleGetBankCashAccount, handleList as handleListBankCashAccounts, handlePatch as handlePatchBankCashAccount, handleSearch as handleSearchBankCashAccounts, handleUpdate as handleUpdateBankCashAccount } from "@voyzu/core/common/bank-cash-accounts/server";
import { CompanyBankCashAccountsListPage, CompanyBankCashAccountDetailPage } from "@voyzu/core/company-bank-cash-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-bank-cash-accounts.page.list",
    pageTitle: "Bank / Cash Accounts",
    helpPath: "modules-help/company-ledger/bank-cash-accounts",
    path: "/finance/settings/bank-cash-accounts",
    Page: CompanyBankCashAccountsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.company-bank-cash-accounts.page.detail",
    pageTitle: "Bank / Cash Account",
    helpPath: "modules-help/company-ledger/bank-cash-accounts",
    path: "/finance/settings/bank-cash-accounts/[code]",
    Page: CompanyBankCashAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
      { label: "Bank / Cash Accounts", href: "/finance/settings/bank-cash-accounts" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
