
export const pageRoutes = {
  list: {
    id: "voyzu.countryTaxSettings.page.list", pageTitle: "Country Tax Settings",
    path: "/finance/global-settings/country-tax-settings", loadPage: () => import("./server/pages/CountryTaxSettingsListSlotPage").then((module) => module.CountryTaxSettingsListSlotPage),
    breadcrumbBase: [{ label: "Finance", href: "/finance/journals" }, { label: "Global Settings" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.countryTaxSettings.page.detail", pageTitle: "Country Tax Settings",
    path: "/finance/global-settings/country-tax-settings/[code]", loadPage: () => import("./server/pages/CountryTaxSettingDetailSlotPage").then((module) => module.CountryTaxSettingDetailSlotPage),
    breadcrumbBase: [
      { label: "Finance", href: "/finance/journals" },
      { label: "Global Settings" },
      { label: "Country Tax Settings", href: "/finance/global-settings/country-tax-settings" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
