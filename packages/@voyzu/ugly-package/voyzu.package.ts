import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { uglyPackageModule } from "./modules/ugly/module";

export const uglyPackage = {
  modules: [uglyPackageModule],
} as const satisfies VoyzuPackageDefinition;

export default uglyPackage;
