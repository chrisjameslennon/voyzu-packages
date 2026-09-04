import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";
import { pageRoutes as countryTaxSettingsPageRoutes } from "@voyzu/finance/country-tax-settings/pages.routes";

export const settingsLeftNav = [{
  slotId: "settings.integration",
  items: [{
    label: "Country Tax Settings",
    icon: "public",
    routeId: countryTaxSettingsPageRoutes.list.id,
  }],
}] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default settingsLeftNav;
