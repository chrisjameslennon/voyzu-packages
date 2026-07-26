import { helloModule } from "../modules/hello-module/module";
import { HelloModulePage } from "../modules/hello-module/server";
import type { VoyzuSurfaceRoute } from "@voyzu/ui-surface/types";

import { helloModulesLeftNav } from "./hello-modules.left-nav";

export const helloModulesPageRoutes = [
  {
    ...helloModule.pageRoutes.home,
    path: "/hello-module",
    Page: HelloModulePage,
  },
] satisfies VoyzuSurfaceRoute[];

export const helloModulesUiDomain = {
  id: "voyzu.hello-modules.ui-domain",
  label: "Hello",
  topNavItem: {
    label: "Hello",
    routeId: helloModule.pageRoutes.home.id,
  },
  pageRoutes: helloModulesPageRoutes,
  leftNav: helloModulesLeftNav,
} as const;

export default helloModulesUiDomain;
