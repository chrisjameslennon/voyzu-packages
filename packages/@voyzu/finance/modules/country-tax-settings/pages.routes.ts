export const pageRoutes = {
  "voyzu.countryTaxSettings.page.list": {
    httpApiDocumentationGroupId: "finance.country-tax-settings",
     pageTitle: "Country Tax Settings",
    path: "/finance/global-settings/country-tax-settings", loadPage: () => import("./server/pages/CountryTaxSettingsListPage").then((module) => module.CountryTaxSettingsListPage),
    breadcrumbBase: [{ label: "Finance", href: "/finance/journals" }, { label: "Global Settings" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.countryTaxSettings.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.country-tax-settings",
     pageTitle: "Country Tax Settings",
    path: "/finance/global-settings/country-tax-settings/[code]", loadPage: () => import("./server/pages/CountryTaxSettingDetailPage").then((module) => module.CountryTaxSettingDetailPage),
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Global Settings" },
      { label: "Country Tax Settings", href: "/finance/global-settings/country-tax-settings" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
