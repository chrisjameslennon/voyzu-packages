import { companyFinancePageAuth } from "@voyzu/finance/common/server";
import { handleListInventoryControlAccounts, handlePatchInventoryControlAccount } from "@voyzu/finance/common/inventory-control-accounts/server";
import { CompanyInventoryControlAccountsPage, CompanyInventoryControlAccountDetailPage } from "@voyzu/finance/company-inventory-control-accounts/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-inventory-control-accounts.page.list",
    pageTitle: "Inventory Control Accounts",
    helpPath: "modules-help/company-ledger/inventory-control-accounts",
    path: "/finance/settings/control-accounts/inventory",
    Page: CompanyInventoryControlAccountsPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-inventory-control-accounts.page.detail",
    pageTitle: "Inventory Control Accounts",
    helpPath: "modules-help/company-ledger/inventory-control-accounts",
    path: "/finance/settings/control-accounts/inventory/[code]",
    Page: CompanyInventoryControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Inventory Control Accounts", href: "/finance/settings/control-accounts/inventory" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
