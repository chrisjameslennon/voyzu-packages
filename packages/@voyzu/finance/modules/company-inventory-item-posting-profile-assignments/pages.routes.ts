import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-inventory-item-posting-profile-assignments.page.list",
    pageTitle: "Posting Profile Assignments",
    helpPath: "modules-help/company-ledger/inventory-item-posting-profiles",
    path: "/finance/inventory/item-posting-profile-assignments",
    loadPage: () => import("./server/pages/CompanyInventoryItemPostingProfileAssignmentsPage").then((module) => module.CompanyInventoryItemPostingProfileAssignmentsPage),
    breadcrumbBase: [{ label: "Finance" }, { label: "Settings" }, { label: "Integration" }],
    auth: companyFinancePageAuth,
  },
} as const;
