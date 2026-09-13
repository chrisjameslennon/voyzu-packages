import { implementations } from "./internalApi";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { apiDefinitions } from "./api.routes";
import { pageRoutes } from "./pages.routes";

export const inventoryProcessingModule = {
  implements: implementations,
  apiDefinitions,
  pageRoutes,
} as const satisfies VoyzuPackageModuleDefinition;

export default inventoryProcessingModule;
