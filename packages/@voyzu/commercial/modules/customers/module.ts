import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";
import { defines, implementations } from "./internalApi";

export const customersModule = {
  pageRoutes,
  defines,
  implements: implementations } as const satisfies VoyzuPackageModuleDefinition;
export default customersModule;
