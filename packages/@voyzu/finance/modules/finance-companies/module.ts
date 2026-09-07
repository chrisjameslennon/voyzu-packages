import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { components } from "./components";

export const financeCompaniesModule = { pageRoutes: {}, apiDefinitions, components } as const satisfies VoyzuPackageModuleDefinition;
export default financeCompaniesModule;
