import { implementations } from "./internalApi";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";

import { pageRoutes } from "./pages.routes";

export const countryTaxSettingsModule = {
  implements: implementations, apiDefinitions, pageRoutes } as const satisfies VoyzuPackageModuleDefinition;
export default countryTaxSettingsModule;
