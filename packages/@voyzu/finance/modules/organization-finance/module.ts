import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { apiDefinitions } from "./api.routes";
import { components } from "./components";

export const organizationFinanceModule = { pageRoutes: {}, apiDefinitions, components } as const satisfies VoyzuPackageModuleDefinition;
export default organizationFinanceModule;
