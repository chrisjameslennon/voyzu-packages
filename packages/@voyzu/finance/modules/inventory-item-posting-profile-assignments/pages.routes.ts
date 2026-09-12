import { companyFinancePageAuth } from "../finance-companies/server/lib/company-finance-page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-inventory-item-posting-profile-assignments.page.list",
    pageTitle: "Posting Profile Assignments",
    helpPath: "modules-help/company-ledger/inventory-item-posting-profiles",
    path: "/finance/inventory/item-posting-profile-assignments",
    loadPage: () => import("./server/pages/InventoryItemPostingProfileAssignmentsPage").then((module) => module.InventoryItemPostingProfileAssignmentsPage),
    breadcrumbBase: [{ label: "Finance" }, { label: "Settings" }, { label: "Integration" }],
    auth: companyFinancePageAuth,
  },
} as const;
