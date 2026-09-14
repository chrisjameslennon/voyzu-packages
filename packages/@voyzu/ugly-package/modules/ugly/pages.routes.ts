export const pageRoutes = {
  "voyzu.ugly-package.page.home": {
    httpApiDocumentationGroupId: "ugly-package.ugly",
    path: "/ugly-package",
    loadPage: () => import("./server/pages/UglyHomePage").then((module) => module.UglyHomePage),
    pageTitle: "Ugly Package",
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.ugly-package.page.developer-freedom": {
    httpApiDocumentationGroupId: "ugly-package.ugly",
    path: "/ugly-package/developer-freedom",
    loadPage: () => import("./server/pages/DeveloperFreedomPage").then((module) => module.DeveloperFreedomPage),
    pageTitle: "the bare minimum",
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.ugly-package.page.byo-dependencies": {
    httpApiDocumentationGroupId: "ugly-package.ugly",
    path: "/ugly-package/byo-dependencies",
    loadPage: () => import("./server/pages/ByoDependenciesPage").then((module) => module.ByoDependenciesPage),
    pageTitle: "BYO Dependencies",
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.ugly-package.page.raw-request-response": {
    queryParams: {
      view: { type: "string" },
    },
    httpApiDocumentationGroupId: "ugly-package.ugly",
    path: "/ugly-package/raw-request-response",
    loadPage: () => import("./server/pages/RawRequestResponsePage").then((module) => module.RawRequestResponsePage),
    pageTitle: "Raw request / response",
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
