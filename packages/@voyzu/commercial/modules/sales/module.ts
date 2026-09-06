import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";
import { apiDefinitions } from "./api.routes";

export const salesModule = { pageRoutes, apiDefinitions } as const satisfies VoyzuPackageModuleDefinition;
export default salesModule;
