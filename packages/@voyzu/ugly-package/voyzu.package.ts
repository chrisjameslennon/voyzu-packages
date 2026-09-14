import { httpApiRoutes as routes0 } from "./modules/ugly/http-api.routes";
import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as uglyPageRoutes } from "./modules/ugly/pages.routes";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { uglyPackageModule } from "./modules/ugly/module";

export const uglyPackage = {
  contracts: {
    uiSurface: {
      "topnav.menu": {
        "ugly-package": {
          "label": "Ugly Package",
          "routeId": "voyzu.ugly-package.page.home"
        }
      },
    },
    pageRouting: {
      roots: {
        "/ugly-package": {
          routes: mergePageRoutes(
            uglyPageRoutes,
          ),
        },
      },
    },
    httpApiRouting: {
      roots: ["/ugly-package"],
      routes: { ...routes0 },
    },
    httpApiDocumentation: {
      "sections": {
        "ugly-package.operations": {
          "title": "Operations",
          "description": "Operations HTTP operations for @voyzu/ugly-package.",
          "groups": {
            "ugly-package.ugly": {
              "title": "Ugly",
              "description": "Ugly operations.",
              "routes": [
                "ugly-package.ugly.rawRequestResponse"
              ]
            }
          }
        }
      }
    },
  },
  modules: [uglyPackageModule],
} as const satisfies VoyzuPackageDefinition;

export default uglyPackage;
