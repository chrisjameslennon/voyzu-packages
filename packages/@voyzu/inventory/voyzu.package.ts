import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { install } from "./install/manifest";
import { coreModule } from "./modules/core/module";
import { itemsModule } from "./modules/items/module";
import { uninstall } from "./uninstall/manifest";

export const inventoryPackage = {
  modules: [coreModule, itemsModule],
  install,
  uninstall,
} as const satisfies VoyzuPackageDefinition;

export default inventoryPackage;
