import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { commands } from "./commands";
import { pageRoutes } from "./pages.routes";

export const templateReportsModule = {
  pageRoutes, apiDefinitions, commands,
} as const satisfies VoyzuPackageModuleDefinition;

export default templateReportsModule;
