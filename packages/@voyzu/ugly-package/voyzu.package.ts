import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { uglyModule } from "./modules/ugly/module";

export const uglyPackage = {
  modules: [uglyModule],
} as const satisfies VoyzuPackageDefinition;

export default uglyPackage;
