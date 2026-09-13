import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";
import { apiDefinitions } from "./api.routes";
import { internalApi } from "./internal-api";

export const customersModule = { pageRoutes, apiDefinitions, internalApi } as const satisfies VoyzuPackageModuleDefinition;
export default customersModule;
