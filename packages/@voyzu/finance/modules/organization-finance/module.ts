import { implementations } from "./internalApi";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

export const organizationFinanceModule = {
  implements: implementations, pageRoutes: {} } as const satisfies VoyzuPackageModuleDefinition;
export default organizationFinanceModule;
