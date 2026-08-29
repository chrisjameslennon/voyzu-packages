import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { operations } from "./operations";
import { pageRoutes } from "./pages.routes";
export const reportsModule = {
  apiDefinitions,
  operations,
  pageRoutes,
} as const satisfies VoyzuPackageModuleDefinition;
export default reportsModule;
