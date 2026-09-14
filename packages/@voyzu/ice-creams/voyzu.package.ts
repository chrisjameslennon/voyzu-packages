import leftMenu from "./ui-surface/left-nav";
import { httpApiRoutes as routes0 } from "./modules/ice-creams/http-api.routes";
import { httpApiRoutes as routes1 } from "./modules/reports/http-api.routes";
import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as iceCreamsPageRoutes } from "./modules/ice-creams/pages.routes";
import { pageRoutes as reportsPageRoutes } from "./modules/reports/pages.routes";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { install } from "./install/manifest";
import { install as installSampleData } from "./scripts/sample-data/install";
import { uninstall } from "./uninstall/manifest";

/**
 * Golden Voyzu package manifest.
 *
 **/
export const iceCreamsPackage = {
  contracts: {
    uiSurface: {
      "topnav.menu": {
        "ice-creams": {
          "label": "Ice Creams",
          "routeId": "voyzu.ice-creams.page.list"
        }
      },
      "leftnav.menu": {
        "/ice-creams": { content: leftMenu },
      },
    },
    pageRouting: {
      roots: {
        "/ice-creams": {
          routes: mergePageRoutes(
            iceCreamsPageRoutes,
            reportsPageRoutes,
          ),
        },
      },
    },
    httpApiRouting: {
      roots: ["/ice-creams"],
      routes: { ...routes0, ...routes1 },
    },
    httpApiDocumentation: {
      "sections": {
        "ice-creams.operations": {
          "title": "Operations",
          "description": "Operations HTTP operations for @voyzu/ice-creams.",
          "groups": {
            "ice-creams.ice-creams": {
              "title": "Ice Creams",
              "description": "Ice Creams operations.",
              "routes": [
                "ice-creams.ice-creams.list",
                "ice-creams.ice-creams.create",
                "ice-creams.ice-creams.flavors",
                "ice-creams.ice-creams.filter",
                "ice-creams.ice-creams.search",
                "ice-creams.ice-creams.batchGet",
                "ice-creams.ice-creams.batchCreate",
                "ice-creams.ice-creams.batchUpdate",
                "ice-creams.ice-creams.batchPatch",
                "ice-creams.ice-creams.batchDelete",
                "ice-creams.ice-creams.batchActivate",
                "ice-creams.ice-creams.batchDeactivate",
                "ice-creams.ice-creams.get",
                "ice-creams.ice-creams.update",
                "ice-creams.ice-creams.patch",
                "ice-creams.ice-creams.delete",
                "ice-creams.ice-creams.activate",
                "ice-creams.ice-creams.deactivate"
              ]
            },
            "ice-creams.reports": {
              "title": "Reports",
              "description": "Reports operations.",
              "routes": [
                "ice-creams.reports.all"
              ]
            }
          }
        }
      }
    },
  },
  install,
  uninstall,
  scripts: {
    sampleData: installSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default iceCreamsPackage;
