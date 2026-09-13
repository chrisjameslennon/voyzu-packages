import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";
import { apiDefinitions } from "./api.routes";
import { defines, implementations } from "./internalApi";

export const customersModule = {
  pageRoutes,
  apiDefinitions,
  defines,
  implements: implementations,
} as const satisfies VoyzuPackageModuleDefinition;
export default customersModule;
