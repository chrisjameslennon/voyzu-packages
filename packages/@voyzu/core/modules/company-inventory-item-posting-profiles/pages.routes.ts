import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { handleActivate as handleActivateItemPostingProfile, handleBatchActivate as handleBatchActivateItemPostingProfiles, handleBatchCreate as handleBatchCreateItemPostingProfiles, handleBatchDeactivate as handleBatchDeactivateItemPostingProfiles, handleBatchDelete as handleBatchDeleteItemPostingProfiles, handleBatchGet as handleBatchGetItemPostingProfiles, handleBatchPatch as handleBatchPatchItemPostingProfiles, handleBatchUpdate as handleBatchUpdateItemPostingProfiles, handleCreate as handleCreateItemPostingProfile, handleDeactivate as handleDeactivateItemPostingProfile, handleDelete as handleDeleteItemPostingProfile, handleFilter as handleFilterItemPostingProfiles, handleGet as handleGetItemPostingProfile, handleList as handleListItemPostingProfiles, handlePatch as handlePatchItemPostingProfile, handleSearch as handleSearchItemPostingProfiles, handleUpdate as handleUpdateItemPostingProfile } from "@voyzu/core/common/inventory-item-posting-profiles/server";
import { CompanyInventoryItemPostingProfilesListPage, CompanyInventoryItemPostingProfileDetailPage } from "@voyzu/core/company-inventory-item-posting-profiles/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-inventory-item-posting-profiles.page.list",
    pageTitle: "Item Posting Profiles",
    helpPath: "modules-help/company-ledger/inventory-item-posting-profiles",
    path: "/finance/inventory/item-posting-profiles",
    Page: CompanyInventoryItemPostingProfilesListPage,
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
    Page: CompanyInventoryItemPostingProfileDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Item Posting Profiles", href: "/finance/inventory/item-posting-profiles" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
