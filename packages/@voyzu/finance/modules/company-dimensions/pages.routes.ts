import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-dimensions.page.list",
    pageTitle: "Dimensions",
    helpPath: "modules-help/company-ledger/dimensions",
    path: "/finance/settings/dimensions",
    loadPage: () => import("./server/pages/CompanyDimensionsListPage").then((module) => module.CompanyDimensionsListPage),
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
    loadPage: () => import("./server/pages/CompanyDimensionDetailPage").then((module) => module.CompanyDimensionDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Dimensions", href: "/finance/settings/dimensions" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
