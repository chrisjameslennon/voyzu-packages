import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as uglyPageRoutes } from "./modules/ugly/pages.routes";
import { httpApiRouting, httpApiDocumentation } from "./http-api.contracts";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { uglyPackageModule } from "./modules/ugly/module";

export const uglyPackage = {
  contracts: {
    pageRouting: {
      roots: ["/ugly-package"],
      routes: mergePageRoutes(
        uglyPageRoutes,
      ),
    }, httpApiRouting, httpApiDocumentation },
  modules: [uglyPackageModule],
} as const satisfies VoyzuPackageDefinition;

export default uglyPackage;
