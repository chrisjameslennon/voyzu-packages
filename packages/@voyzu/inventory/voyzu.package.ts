import leftMenu from "./ui-surface/left-nav";
import { httpApiRoutes as routes0 } from "./modules/configuration/http-api.routes";
import { httpApiRoutes as routes1 } from "./modules/financial-activity/http-api.routes";
import { httpApiRoutes as routes2 } from "./modules/items/http-api.routes";
import { httpApiRoutes as routes3 } from "./modules/reports/http-api.routes";
import { httpApiRoutes as routes4 } from "./modules/stock/http-api.routes";
import { pageRoutes as reportPageRoutes } from "./modules/reports/pages.routes";
import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as configurationPageRoutes } from "./modules/configuration/pages.routes";
import { pageRoutes as financialActivityPageRoutes } from "./modules/financial-activity/pages.routes";
import { pageRoutes as itemsPageRoutes } from "./modules/items/pages.routes";
import { pageRoutes as stockPageRoutes } from "./modules/stock/pages.routes";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { install } from "./install/manifest";
import { coreModule } from "./modules/core/module";
import { configurationModule } from "./modules/configuration/module";
import { financialActivityModule } from "./modules/financial-activity/module";
import { itemsModule } from "./modules/items/module";
import { reportsModule } from "./modules/reports/module";
import { sampleData } from "./scripts/sample-data";
import { sampleDataLarge } from "./scripts/sample-data-large";
import { teardownSampleData } from "./scripts/teardown-sample-data";
import { stockModule } from "./modules/stock/module";
import { uninstall } from "./uninstall/manifest";

export const inventoryPackage = {
  contracts: {
    uiSurface: {
      "topnav.menu": {
        "inventory": {
          "label": "Inventory",
          "routeId": "voyzu.inventory.items.page.list"
        }
      },
      "leftnav.menu": {
        "/inventory": { content: leftMenu },
      },
      "leftnav.header": {
        "/inventory": {
          loadComponent: () => import("./ui-surface/left-nav-header").then(module => module.default),
        },
      },
    },
    pageRouting: {
      roots: {
        "/inventory": {
          routes: mergePageRoutes(
            reportPageRoutes,
            configurationPageRoutes,
            financialActivityPageRoutes,
            itemsPageRoutes,
            stockPageRoutes,
          ),
        },
      },
    },
    httpApiRouting: {
      roots: ["/inventory"],
      routes: { ...routes0, ...routes1, ...routes2, ...routes3, ...routes4 },
    },
    httpApiDocumentation: {
      "sections": {
        "inventory.configuration": {
          "title": "Configuration",
          "description": "Configuration HTTP operations for @voyzu/inventory.",
          "groups": {
            "inventory.configuration": {
              "title": "Configuration",
              "description": "Configuration operations.",
              "routes": [
                "inventory.configuration.list",
                "inventory.configuration.create",
                "inventory.configuration.get",
                "inventory.configuration.patch",
                "inventory.configuration.transition",
                "inventory.configuration.addOption",
                "inventory.configuration.patchOption",
                "inventory.configuration.deleteOption"
              ]
            },
            "inventory.items": {
              "title": "Items",
              "description": "Items operations.",
              "routes": [
                "inventory.items.list",
                "inventory.items.options",
                "inventory.items.reserveSku",
                "inventory.items.create",
                "inventory.items.get",
                "inventory.items.patch",
                "inventory.items.delete",
                "inventory.items.activate",
                "inventory.items.deactivate",
                "inventory.items.batchActivate",
                "inventory.items.batchDeactivate",
                "inventory.items.batchChangeCategory",
                "inventory.items.deletionImpact",
                "inventory.items.batchDelete"
              ]
            }
          }
        },
        "inventory.operations": {
          "title": "Operations",
          "description": "Operations HTTP operations for @voyzu/inventory.",
          "groups": {
            "inventory.financial-activity": {
              "title": "Financial Activity",
              "description": "Financial Activity operations.",
              "routes": [
                "inventory.financial-activity.list",
                "inventory.financial-activity.get"
              ]
            },
            "inventory.reports": {
              "title": "Reports",
              "description": "Reports operations.",
              "routes": [
                "inventory.reports.report"
              ]
            },
            "inventory.stock": {
              "title": "Stock",
              "description": "Stock operations.",
              "routes": [
                "inventory.stock.positions",
                "inventory.stock.activity",
                "inventory.stock.options",
                "inventory.stock.receive",
                "inventory.stock.issue",
                "inventory.stock.transfer",
                "inventory.stock.reserve",
                "inventory.stock.adjust",
                "inventory.stock.counts",
                "inventory.stock.createCount",
                "inventory.stock.count",
                "inventory.stock.saveCount",
                "inventory.stock.completeCount",
                "inventory.stock.deleteCount"
              ]
            }
          }
        }
      }
    },
    internalApi: { implements: { ...itemsModule.implements, ...stockModule.implements } },

  },
  modules: [
    coreModule,
    itemsModule,
    configurationModule,
    stockModule,
    financialActivityModule,
    reportsModule,
  ],
  install,
  uninstall,
  scripts: {
    sampleData,
    "sample-data-large": sampleDataLarge,
    "teardown-sample-data": teardownSampleData,
  },
} as const satisfies VoyzuPackageDefinition;

export default inventoryPackage;
