import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  "voyzu.company-inventory-control-accounts.page.list": {
    httpApiDocumentationGroupId: "ledger.inventory-control-accounts",
    pageTitle: "Inventory Control Accounts",
    helpPath: "modules-help/company-ledger/inventory-control-accounts",
    path: "/ledger/settings/control-accounts/inventory",
    loadPage: () => import("./server/pages/InventoryControlAccountsPage").then((module) => module.InventoryControlAccountsPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-inventory-control-accounts.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.inventory-control-accounts",
    pageTitle: "Inventory Control Accounts",
    helpPath: "modules-help/company-ledger/inventory-control-accounts",
    path: "/ledger/settings/control-accounts/inventory/[code]",
    loadPage: () => import("./server/pages/InventoryControlAccountDetailPage").then((module) => module.InventoryControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Inventory Control Accounts", href: "/ledger/settings/control-accounts/inventory" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
