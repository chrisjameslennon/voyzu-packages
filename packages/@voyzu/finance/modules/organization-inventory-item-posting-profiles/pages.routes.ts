
export const pageRoutes = {
  list: {
    id: "voyzu.organization-inventory-item-posting-profiles.page.list",
    pageTitle: "Item Posting Profiles",
    helpPath: "modules-help/organization-financial-settings/item-posting-profiles",
    path: "/finance/template/inventory/item-posting-profiles",
    loadPage: () => import("./server/pages/OrganizationInventoryItemPostingProfilesListPage").then((module) => module.OrganizationInventoryItemPostingProfilesListPage),
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
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organization-inventory-item-posting-profiles.page.detail",
    pageTitle: "Item Posting Profile",
    helpPath: "modules-help/organization-financial-settings/item-posting-profiles",
    path: "/finance/template/inventory/item-posting-profiles/[code]",
    loadPage: () => import("./server/pages/OrganizationInventoryItemPostingProfileDetailPage").then((module) => module.OrganizationInventoryItemPostingProfileDetailPage),
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
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
