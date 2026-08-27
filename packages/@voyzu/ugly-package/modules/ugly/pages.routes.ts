export const pageRoutes = {
  home: {
    id: "voyzu.ugly-package.page.home",
    path: "/ugly-package",
    loadPage: () => import("./server/pages/UglyHomePage").then((module) => module.UglyHomePage),
    pageTitle: "Ugly Package",
    auth: { required: true, minRole: "STANDARD" },
  },
  developerFreedom: {
    id: "voyzu.ugly-package.page.developer-freedom",
    path: "/ugly-package/developer-freedom",
    loadPage: () => import("./server/pages/DeveloperFreedomPage").then((module) => module.DeveloperFreedomPage),
    pageTitle: "the bare minimum",
    auth: { required: true, minRole: "STANDARD" },
  },
  byoDependencies: {
    id: "voyzu.ugly-package.page.byo-dependencies",
    path: "/ugly-package/byo-dependencies",
    loadPage: () => import("./server/pages/ByoDependenciesPage").then((module) => module.ByoDependenciesPage),
    pageTitle: "BYO Dependencies",
    auth: { required: true, minRole: "STANDARD" },
  },
  rawRequestResponse: {
    id: "voyzu.ugly-package.page.raw-request-response",
    path: "/ugly-package/raw-request-response",
    loadPage: () => import("./server/pages/RawRequestResponsePage").then((module) => module.RawRequestResponsePage),
    pageTitle: "Raw request / response",
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
