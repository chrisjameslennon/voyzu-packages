import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-dimensions.page.list": {

    httpApiDocumentationGroupId: "finance.dimensions",
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
  "voyzu.company-dimensions.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.dimensions",
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
