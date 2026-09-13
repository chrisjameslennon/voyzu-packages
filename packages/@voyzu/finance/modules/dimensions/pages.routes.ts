import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-dimensions.page.list",
    pageTitle: "Dimensions",
    helpPath: "modules-help/company-ledger/dimensions",
    path: "/finance/settings/dimensions",
    loadPage: () => import("./server/pages/DimensionsListPage").then((module) => module.DimensionsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-dimensions.page.detail",
    pageTitle: "Dimension",
    helpPath: "modules-help/company-ledger/dimensions",
    path: "/finance/settings/dimensions/[code]",
    loadPage: () => import("./server/pages/DimensionDetailPage").then((module) => module.DimensionDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Dimensions", href: "/finance/settings/dimensions" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
