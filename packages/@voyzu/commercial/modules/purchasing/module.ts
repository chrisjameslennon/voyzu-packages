import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";
import { apiDefinitions } from "./api.routes";

export const purchasingModule = { pageRoutes, apiDefinitions } as const satisfies VoyzuPackageModuleDefinition;
export default purchasingModule;
