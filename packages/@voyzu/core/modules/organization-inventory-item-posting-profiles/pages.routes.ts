import { handleActivate as handleItemPostingProfilesActivate, handleBatchActivate as handleItemPostingProfilesBatchActivate, handleBatchCreate as handleItemPostingProfilesBatchCreate, handleBatchDeactivate as handleItemPostingProfilesBatchDeactivate, handleBatchDelete as handleItemPostingProfilesBatchDelete, handleBatchGet as handleItemPostingProfilesBatchGet, handleBatchPatch as handleItemPostingProfilesBatchPatch, handleBatchUpdate as handleItemPostingProfilesBatchUpdate, handleCreate as handleItemPostingProfilesCreate, handleDeactivate as handleItemPostingProfilesDeactivate, handleDelete as handleItemPostingProfilesDelete, handleFilter as handleItemPostingProfilesFilter, handleGet as handleItemPostingProfilesGet, handleList as handleItemPostingProfilesList, handlePatch as handleItemPostingProfilesPatch, handleSearch as handleItemPostingProfilesSearch, handleUpdate as handleItemPostingProfilesUpdate } from "@voyzu/core/common/inventory-item-posting-profiles/server";
import { OrganizationInventoryItemPostingProfilesListPage, OrganizationInventoryItemPostingProfileDetailPage } from "@voyzu/core/organization-inventory-item-posting-profiles/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-inventory-item-posting-profiles.page.list",
    pageTitle: "Item Posting Profiles",
    helpPath: "modules-help/organization-financial-settings/item-posting-profiles",
    path: "/finance/template/inventory/item-posting-profiles",
    Page: OrganizationInventoryItemPostingProfilesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  detail: {
    id: "voyzu.organization-inventory-item-posting-profiles.page.detail",
    pageTitle: "Item Posting Profile",
    helpPath: "modules-help/organization-financial-settings/item-posting-profiles",
    path: "/finance/template/inventory/item-posting-profiles/[code]",
    Page: OrganizationInventoryItemPostingProfileDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
      {
        label: "Item Posting Profiles",
        href: "/finance/template/inventory/item-posting-profiles",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
