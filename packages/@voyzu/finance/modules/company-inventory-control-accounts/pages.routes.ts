import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-inventory-control-accounts.page.list",
    pageTitle: "Inventory Control Accounts",
    helpPath: "modules-help/company-ledger/inventory-control-accounts",
    path: "/finance/settings/control-accounts/inventory",
    loadPage: () => import("./server/pages/CompanyInventoryControlAccountsPage").then((module) => module.CompanyInventoryControlAccountsPage),
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
    loadPage: () => import("./server/pages/CompanyInventoryControlAccountDetailPage").then((module) => module.CompanyInventoryControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Inventory Control Accounts", href: "/finance/settings/control-accounts/inventory" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
