import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { commands } from "./commands";
import { components } from "./components";
import { pageRoutes } from "./pages.routes";

export const countryTaxSettingsModule = { apiDefinitions, commands, components, pageRoutes } as const satisfies VoyzuPackageModuleDefinition;
export default countryTaxSettingsModule;
