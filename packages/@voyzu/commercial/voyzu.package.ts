import leftMenu from "./ui-surface/left-nav";

import { mergePageRoutes } from "@voyzu/types/page-routing";
import { pageRoutes as customersPageRoutes } from "./modules/customers/pages.routes";
import { pageRoutes as productsPageRoutes } from "./modules/products/pages.routes";
import { pageRoutes as purchasingPageRoutes } from "./modules/purchasing/pages.routes";
import { pageRoutes as salesPageRoutes } from "./modules/sales/pages.routes";
import { pageRoutes as settingsPageRoutes } from "./modules/settings/pages.routes";
import { pageRoutes as suppliersPageRoutes } from "./modules/suppliers/pages.routes";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";
import { customersModule } from "./modules/customers/module";

export const commercialPackage = {
  contracts: {
    uiSurface: {
      "topnav.menu": {
        "commercial": {
          "label": "Commercial",
          "routeId": "voyzu.commercial.customers.page.customers"
        }
      },
      "leftnav.menu": {
        "/commercial": { content: leftMenu },
      },
      "leftnav.header": {
        "/commercial": {
          loadComponent: () => import("./ui-surface/left-nav-header").then(module => module.default),
        },
      },
    },
    pageRouting: {
      roots: {
        "/commercial": {
          routes: mergePageRoutes(
            customersPageRoutes,
            productsPageRoutes,
            purchasingPageRoutes,
            salesPageRoutes,
            settingsPageRoutes,
            suppliersPageRoutes,
          ),
        },
      },
    },
    httpApiRouting: {
      roots: [],
      routes: {  },
    },
    httpApiDocumentation: {
      "sections": {}
    },
    internalApi: {
      defines: { ...customersModule.defines },
      implements: { ...customersModule.implements },
    },
  },
} as const satisfies VoyzuPackageDefinition;

export default commercialPackage;
