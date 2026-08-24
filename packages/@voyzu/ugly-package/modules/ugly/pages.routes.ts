import {
  ByoDependenciesPage,
  DeveloperFreedomPage,
  RawRequestResponsePage,
  UglyHomePage,
} from "./server/index";

export const pageRoutes = {
  home: {
    id: "voyzu.ugly-package.page.home",
    path: "/ugly-package",
    Page: UglyHomePage,
    pageTitle: "Ugly Package",
    auth: { required: true, minRole: "STANDARD" },
  },
  developerFreedom: {
    id: "voyzu.ugly-package.page.developer-freedom",
    path: "/ugly-package/developer-freedom",
    Page: DeveloperFreedomPage,
    pageTitle: "the bare minimum",
    auth: { required: true, minRole: "STANDARD" },
  },
  byoDependencies: {
    id: "voyzu.ugly-package.page.byo-dependencies",
    path: "/ugly-package/byo-dependencies",
    Page: ByoDependenciesPage,
    pageTitle: "BYO Dependencies",
    auth: { required: true, minRole: "STANDARD" },
  },
  rawRequestResponse: {
    id: "voyzu.ugly-package.page.raw-request-response",
    path: "/ugly-package/raw-request-response",
    Page: RawRequestResponsePage,
    pageTitle: "Raw request / response",
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
