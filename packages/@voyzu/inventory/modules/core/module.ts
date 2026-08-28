import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { apiDefinitions } from "./api.routes";
import { operations } from "./operations";
import { pageRoutes } from "./pages.routes";

export const coreModule = {
  pageRoutes,
  apiDefinitions,
  operations,
} as const satisfies VoyzuPackageModuleDefinition;

export default coreModule;
