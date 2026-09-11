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
    semanticDataDefinition: {
      implements: {
        inventoryItem: {
          get: (id: number) => import("./modules/items/server/lib/inventory-catalog.provider").then(m => m.get(id)),
          queries: { byOrganization: (input: { organizationId: number }) => import("./modules/items/server/lib/inventory-catalog.provider").then(m => m.byOrganization(input)) },
        },
        "inventoryItem.operational": {
          get: (id: number) => import("./modules/items/server/lib/inventory-catalog.provider").then(m => m.getOperational(id)),
          queries: { bySkus: (input: { organizationId: number; skus: string[] }) => import("./modules/items/server/lib/inventory-catalog.provider").then(m => m.bySkus(input)) },
        },
        stockActivity: {
          get: (id: number) => import("./modules/stock/server/lib/inventory-activity.provider").then(m => m.get(id)),
          queries: { byCode: (input: { organizationId: number; code: string }) => import("./modules/stock/server/lib/inventory-activity.provider").then(m => m.byCode(input)) },
        },
      },
    },
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
