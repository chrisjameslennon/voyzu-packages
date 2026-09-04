import { component } from "@voyzu/ui-surface/server";

export const components = {
  countryTaxSettings: component.defineLazy(
    "settings.country-tax-settings",
    () => import("./server/components/CountryTaxSettingsComponent")
      .then((module) => module.CountryTaxSettingsComponent),
  ),
} as const;
