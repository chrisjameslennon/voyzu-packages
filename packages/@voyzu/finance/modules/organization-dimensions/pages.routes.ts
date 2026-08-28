
export const pageRoutes = {
  list: {
    id: "voyzu.organization-dimensions.page.list",
    pageTitle: "Dimensions",
    helpPath: "modules-help/organization-financial-settings/dimensions",
    path: "/finance/dimensions",
    loadPage: () => import("./server/pages/OrganizationDimensionsListPage").then((module) => module.OrganizationDimensionsListPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organization-dimensions.page.detail",
    pageTitle: "Dimension",
    helpPath: "modules-help/organization-financial-settings/dimensions",
    path: "/finance/dimensions/[code]",
    loadPage: () => import("./server/pages/OrganizationDimensionDetailPage").then((module) => module.OrganizationDimensionDetailPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Dimensions",
        href: "/finance/dimensions",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
