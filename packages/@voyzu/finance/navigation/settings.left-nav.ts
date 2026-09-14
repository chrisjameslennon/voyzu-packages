import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";

export const settingsLeftNav = [{
  slotId: "settings.integration",
  items: [{
    label: "Country Tax Settings",
    icon: "public",
    routeId: "voyzu.countryTaxSettings.page.list",
  }],
}] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default settingsLeftNav;
