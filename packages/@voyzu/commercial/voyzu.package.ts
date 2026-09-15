import { productPricingCategoriesModule } from "./modules/product-pricing-categories/module";
import leftMenu from "./ui-surface/left-nav";
import { pageRoutes as dashboardPageRoutes } from "./modules/dashboard/pages.routes";

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
  scripts: {
    sampleData: async () => {
      const { sampleData } = await import("./scripts/sample-data");
      await sampleData();
    },
  },
  contracts: {
    uiSurface: {
      "topnav.menu": {
        "commercial": {
          "label": "Commercial",
          "routeId": "voyzu.commercial.dashboard.page.dashboard"
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
            dashboardPageRoutes,
            customersPageRoutes,
            productsPageRoutes,
            productPricingCategoriesModule.pageRoutes,
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
