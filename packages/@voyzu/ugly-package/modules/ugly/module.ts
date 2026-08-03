import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { DeveloperFreedomPage } from "./pages/DeveloperFreedomPage";
import { UglyHomePage } from "./pages/UglyHomePage";

export const uglyModule = {
  pageRoutes: {
    home: {
      id: "voyzu.ugly-package.page.home",
      path: "/ugly-package",
      Page: UglyHomePage,
      pageTitle: "Ugly Package",
      auth: { required: true, minRole: "COMPANY_USER" },
    },
    developerFreedom: {
      id: "voyzu.ugly-package.page.developer-freedom",
      path: "/ugly-package/developer-freedom",
      Page: DeveloperFreedomPage,
      pageTitle: "Developer Freedom",
      auth: { required: true, minRole: "COMPANY_USER" },
    },
  },
  apiDefinitions: {},
} as const satisfies VoyzuPackageModuleDefinition;

export default uglyModule;
