import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";

import { DeveloperFreedomPage } from "./pages/DeveloperFreedomPage";
import { ByoDependenciesPage } from "./pages/ByoDependenciesPage";
import { RawRequestResponsePage } from "./pages/RawRequestResponsePage";
import { UglyHomePage } from "./pages/UglyHomePage";
import { handleRawRequestResponse } from "./server/api/raw-request-response.http.handlers";

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
      pageTitle: "the bare minimum",
      auth: { required: true, minRole: "COMPANY_USER" },
    },
    byoDependencies: {
      id: "voyzu.ugly-package.page.byo-dependencies",
      path: "/ugly-package/byo-dependencies",
      Page: ByoDependenciesPage,
      pageTitle: "BYO Dependencies",
      auth: { required: true, minRole: "COMPANY_USER" },
    },
    rawRequestResponse: {
      id: "voyzu.ugly-package.page.raw-request-response",
      path: "/ugly-package/raw-request-response",
      Page: RawRequestResponsePage,
      pageTitle: "Raw request / response",
      auth: { required: true, minRole: "COMPANY_USER" },
    },
  },
  apiDefinitions: {
    rawRequestResponse: {
      method: "GET",
      path: "/ugly-package/raw-request-response",
      handler: handleRawRequestResponse,
    },
  },
} as const satisfies VoyzuPackageModuleDefinition;

export default uglyModule;
