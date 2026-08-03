import type {
  VoyzuPackageModuleDefinition,
  VoyzuPackageNavigationDomain,
} from "@voyzu/types/framework";

import {
  coreFinanceModules,
  coreOrganizationModules,
} from "../voyzu.package";
import { financeLeftNav } from "./finance.left-nav";
import { organizationLeftNav } from "./organization.left-nav";

function routeIds(modules: readonly VoyzuPackageModuleDefinition[]) {
  return modules.flatMap((moduleDefinition) =>
    (Object.values(moduleDefinition.pageRoutes) as { id: string }[]).map(({ id }) => id)
  );
}

const organizationRouteIds = [
  ...routeIds(coreOrganizationModules),
];

const financeRouteIds = routeIds(coreFinanceModules);

const domains = [
  {
    label: "Organization",
    routeId: coreOrganizationModules[0].pageRoutes.detail.id,
    routeIds: organizationRouteIds,
    leftNav: organizationLeftNav,
  },
  {
    label: "Finance",
    routeId: coreFinanceModules[0].pageRoutes.list.id,
    routeIds: financeRouteIds,
    leftNav: financeLeftNav,
  },
] as const satisfies readonly VoyzuPackageNavigationDomain[];

export default domains;
