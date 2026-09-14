import { httpApiRouting, httpApiDocumentation } from "./http-api.contracts";
import type { VoyzuPackageDefinition } from "@voyzu/types/framework";

import { uglyPackageModule } from "./modules/ugly/module";

export const uglyPackage = {
  contracts: { httpApiRouting, httpApiDocumentation },
  modules: [uglyPackageModule],
} as const satisfies VoyzuPackageDefinition;

export default uglyPackage;
