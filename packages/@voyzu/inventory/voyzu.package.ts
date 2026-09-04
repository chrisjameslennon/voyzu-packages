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
