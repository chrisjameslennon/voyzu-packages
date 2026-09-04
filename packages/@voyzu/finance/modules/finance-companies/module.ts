import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { commands } from "./commands";
import { components } from "./components";

export const financeCompaniesModule = { pageRoutes: {}, apiDefinitions, commands, components } as const satisfies VoyzuPackageModuleDefinition;
export default financeCompaniesModule;
