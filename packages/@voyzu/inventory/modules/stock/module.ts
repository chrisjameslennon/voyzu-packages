import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { operations } from "./operations";
import { pageRoutes } from "./pages.routes";
export const stockModule = {
  apiDefinitions,
  operations,
  pageRoutes,
} as const satisfies VoyzuPackageModuleDefinition;
export default stockModule;
