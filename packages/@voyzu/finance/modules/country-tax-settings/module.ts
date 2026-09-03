import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { commands } from "./commands";
import { pageRoutes } from "./pages.routes";

export const countryTaxSettingsModule = { apiDefinitions, commands, pageRoutes } as const satisfies VoyzuPackageModuleDefinition;
export default countryTaxSettingsModule;
