
export const pageRoutes = {
  list: {
    id: "voyzu.countryTaxSettings.page.list", pageTitle: "Country Tax Settings",
    path: "/finance/country-tax-settings", loadPage: () => import("./server/pages/CountryTaxSettingsListPage").then((module) => module.CountryTaxSettingsListPage),
    breadcrumbBase: [{ label: "Finance Admin", href: "/finance" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.countryTaxSettings.page.detail", pageTitle: "Country Tax Settings",
    path: "/finance/country-tax-settings/[code]", loadPage: () => import("./server/pages/CountryTaxSettingDetailPage").then((module) => module.CountryTaxSettingDetailPage),
    breadcrumbBase: [
      { label: "Finance Admin", href: "/finance" },
      { label: "Country Tax Settings", href: "/finance/country-tax-settings" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
