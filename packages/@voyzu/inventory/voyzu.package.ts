import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { install } from "./install/manifest";
import { coreModule } from "./modules/core/module";
import { configurationModule } from "./modules/configuration/module";
import { itemsModule } from "./modules/items/module";
import { reportsModule } from "./modules/reports/module";
import { sampleData } from "./scripts/sample-data";
import { sampleDataLarge } from "./scripts/sample-data-large";
import { stockModule } from "./modules/stock/module";
import { uninstall } from "./uninstall/manifest";

export const inventoryPackage = {
  modules: [
    coreModule,
    itemsModule,
    configurationModule,
    stockModule,
    reportsModule,
  ],
  install,
  uninstall,
  scripts: {
    sampleData,
    "sample-data-large": sampleDataLarge,
  },
} as const satisfies VoyzuPackageDefinition;

export default inventoryPackage;
