import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-inventory-item-posting-profiles.page.list",
    pageTitle: "Item Posting Profiles",
    helpPath: "modules-help/company-ledger/inventory-item-posting-profiles",
    path: "/finance/inventory/item-posting-profiles",
    loadPage: () => import("./server/pages/InventoryItemPostingProfilesListPage").then((module) => module.InventoryItemPostingProfilesListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-inventory-item-posting-profiles.page.detail",
    pageTitle: "Item Posting Profile",
    helpPath: "modules-help/company-ledger/inventory-item-posting-profiles",
    path: "/finance/inventory/item-posting-profiles/[code]",
    loadPage: () => import("./server/pages/InventoryItemPostingProfileDetailPage").then((module) => module.InventoryItemPostingProfileDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Item Posting Profiles", href: "/finance/inventory/item-posting-profiles" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
