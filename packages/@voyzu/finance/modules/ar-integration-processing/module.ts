import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { apiDefinitions } from "./api.routes";
import { pageRoutes } from "./pages.routes";

export const arIntegrationProcessingModule = { apiDefinitions, pageRoutes } as const satisfies VoyzuPackageModuleDefinition;
export default arIntegrationProcessingModule;
