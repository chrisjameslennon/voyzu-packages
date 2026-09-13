import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";
import { apiDefinitions } from "./api.routes";
import { crossPackageApi } from "./cross-package-api";

export const customersModule = { pageRoutes, apiDefinitions, crossPackageApi } as const satisfies VoyzuPackageModuleDefinition;
export default customersModule;
