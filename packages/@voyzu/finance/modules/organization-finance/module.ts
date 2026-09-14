import { implementations } from "./internalApi";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";

export const organizationFinanceModule = {
  implements: implementations, pageRoutes: {}, apiDefinitions } as const satisfies VoyzuPackageModuleDefinition;
export default organizationFinanceModule;
