
export const pageRoutes = {
  list: {
    id: "voyzu.countryTaxSettings.page.list", pageTitle: "Country Tax Settings",
    path: "/settings/integration/country-tax-settings", loadPage: () => import("./server/pages/CountryTaxSettingsListSlotPage").then((module) => module.CountryTaxSettingsListSlotPage),
    breadcrumbBase: [{ label: "Settings", href: "/settings/users" }, { label: "Integration" }],
    auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.countryTaxSettings.page.detail", pageTitle: "Country Tax Settings",
    path: "/settings/integration/country-tax-settings/[code]", loadPage: () => import("./server/pages/CountryTaxSettingDetailSlotPage").then((module) => module.CountryTaxSettingDetailSlotPage),
    breadcrumbBase: [
      { label: "Settings", href: "/settings/users" },
      { label: "Integration" },
      { label: "Country Tax Settings", href: "/settings/integration/country-tax-settings" },
    ],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
