import type {
  VoyzuPackageModuleDefinition,
  VoyzuPackageNavigationDomain,
} from "@voyzu/types/framework";

import {
  financeModules,
  financeTemplateModules,
} from "../voyzu.package";
import { financeLeftNav } from "./finance.left-nav";
import { financeTemplateLeftNav } from "./organization.left-nav";

function routeIds(modules: readonly VoyzuPackageModuleDefinition[]) {
  return modules.flatMap((moduleDefinition) =>
    (Object.values(moduleDefinition.pageRoutes) as { id: string }[]).map(({ id }) => id)
  );
}

const financeTemplateRouteIds = routeIds(financeTemplateModules);

const financeRouteIds = routeIds(financeModules);

const domains = [
  {
    label: "Finance Admin",
    routeId: financeTemplateModules[0].pageRoutes.landing.id,
    routeIds: financeTemplateRouteIds,
    leftNav: financeTemplateLeftNav,
    topNavigationVisible: false,
  },
  {
    label: "Finance",
    routeId: financeModules[0].pageRoutes.list.id,
    routeIds: financeRouteIds,
    leftNav: financeLeftNav,
  },
] as const satisfies readonly VoyzuPackageNavigationDomain[];

export default domains;
