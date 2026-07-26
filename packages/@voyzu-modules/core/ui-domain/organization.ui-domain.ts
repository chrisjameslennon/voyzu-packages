import { organizationModule } from "@voyzu-modules/core/organization";

import { organizationPageRoutes } from "./organization.definition";
import { organizationLeftNav } from "./organization.left-nav";

export const organizationUiDomain = {
  id: "voyzu.core.organization.ui-domain",
  label: "Organization",
  topNavItem: {
    label: "Organization",
    routeId: organizationModule.pageRoutes.detail.id,
  },
  pageRoutes: organizationPageRoutes,
  leftNav: organizationLeftNav,
} as const;

export default organizationUiDomain;
