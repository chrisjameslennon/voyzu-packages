import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  "voyzu.company-inventory-item-posting-profile-assignments.page.list": {
    httpApiDocumentationGroupId: "ledger.inventory-item-posting-profile-assignments",
    pageTitle: "Posting Profile Assignments",
    helpPath: "modules-help/company-ledger/inventory-item-posting-profiles",
    path: "/ledger/inventory/item-posting-profile-assignments",
    loadPage: () => import("./server/pages/InventoryItemPostingProfileAssignmentsPage").then((module) => module.InventoryItemPostingProfileAssignmentsPage),
    breadcrumbBase: [{ label: "Ledger" }, { label: "Settings" }, { label: "Integration" }],
    auth: companyFinancePageAuth,
  },
} as const;
