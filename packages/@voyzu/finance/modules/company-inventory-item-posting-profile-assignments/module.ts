import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { pageRoutes } from "./pages.routes";
export const companyInventoryItemPostingProfileAssignmentsModule = { pageRoutes, apiDefinitions } as const satisfies VoyzuPackageModuleDefinition;
export default companyInventoryItemPostingProfileAssignmentsModule;
