import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-dimensions.page.list": {

    httpApiDocumentationGroupId: "ledger.dimensions",
    pageTitle: "Dimensions",
    helpPath: "modules-help/company-ledger/dimensions",
    path: "/ledger/settings/dimensions",
    loadPage: () => import("./server/pages/DimensionsListPage").then((module) => module.DimensionsListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-dimensions.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.dimensions",
    pageTitle: "Dimension",
    helpPath: "modules-help/company-ledger/dimensions",
    path: "/ledger/settings/dimensions/[code]",
    loadPage: () => import("./server/pages/DimensionDetailPage").then((module) => module.DimensionDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Dimensions", href: "/ledger/settings/dimensions" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
