import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { components } from "./components";
import { pageRoutes } from "./pages.routes";

export const countryTaxSettingsModule = { apiDefinitions, components, pageRoutes } as const satisfies VoyzuPackageModuleDefinition;
export default countryTaxSettingsModule;
