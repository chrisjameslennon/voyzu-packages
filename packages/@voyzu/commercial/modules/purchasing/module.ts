import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { pageRoutes } from "./pages.routes";

export const purchasingModule = { pageRoutes } as const satisfies VoyzuPackageModuleDefinition;
export default purchasingModule;
