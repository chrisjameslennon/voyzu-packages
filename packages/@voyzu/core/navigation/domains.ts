import type {
  VoyzuPackageModuleDefinition,
  VoyzuPackageNavigationDomain,
} from "@voyzu/types/framework";

import {
  coreFinanceModules,
  coreFinanceTemplateModules,
} from "../voyzu.package";
import { financeLeftNav } from "./finance.left-nav";
import { financeTemplateLeftNav } from "./organization.left-nav";

function routeIds(modules: readonly VoyzuPackageModuleDefinition[]) {
  return modules.flatMap((moduleDefinition) =>
    (Object.values(moduleDefinition.pageRoutes) as { id: string }[]).map(({ id }) => id)
  );
}

const financeTemplateRouteIds = routeIds(coreFinanceTemplateModules);

const financeRouteIds = routeIds(coreFinanceModules);

const domains = [
  {
    label: "Finance Template",
    routeId: coreFinanceTemplateModules[0].pageRoutes.landing.id,
    routeIds: financeTemplateRouteIds,
    leftNav: financeTemplateLeftNav,
    topNavigationVisible: false,
  },
  {
    label: "Finance",
    routeId: coreFinanceModules[0].pageRoutes.list.id,
    routeIds: financeRouteIds,
    leftNav: financeLeftNav,
  },
] as const satisfies readonly VoyzuPackageNavigationDomain[];

export default domains;
