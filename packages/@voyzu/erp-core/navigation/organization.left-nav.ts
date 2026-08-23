import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";
import { organizationsModule } from "../modules/organizations/module";
import { organizationAccessModule } from "../modules/organization-access/module";
import { organizationReportsModule } from "../modules/organization-reports/module";

export const organizationLeftNav = [{
  items: [
    { label: "Organizations", icon: "domain", routeId: organizationsModule.pageRoutes.list.id },
    { label: "Organization access", icon: "manage_accounts", routeId: organizationAccessModule.pageRoutes.list.id },
  ],
}, {
  label: "Reports",
  items: [{
    label: "Lists",
    icon: "format_list_bulleted",
    path: "#organization-reports-lists",
    children: [
      { label: "Organizations", routeId: organizationReportsModule.pageRoutes.organizations.id },
      { label: "Countries", routeId: organizationReportsModule.pageRoutes.countries.id },
      { label: "Currencies", routeId: organizationReportsModule.pageRoutes.currencies.id },
    ],
  }],
}] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default organizationLeftNav;
