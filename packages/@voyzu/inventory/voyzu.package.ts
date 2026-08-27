import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { install } from "./install/manifest";
import { itemsModule } from "./modules/items/module";
import { uninstall } from "./uninstall/manifest";

export const inventoryPackage = {
  modules: [itemsModule],
  install,
  uninstall,
} as const satisfies VoyzuPackageDefinition;

export default inventoryPackage;
