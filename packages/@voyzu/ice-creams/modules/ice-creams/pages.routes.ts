export const pageRoutes = {
  "voyzu.ice-creams.page.list": {

    httpApiDocumentationGroupId: "ice-creams.ice-creams",
    path: "/ice-creams",
    loadPage: () => import("./server/pages/IceCreamsListPage").then((module) => module.IceCreamsListPage),
    pageTitle: "Ice Creams",
    helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [],
    auth: { required: true, minRole: "STANDARD" },
  },
  "voyzu.ice-creams.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ice-creams.ice-creams",
    path: "/ice-creams/[code]",
    loadPage: () => import("./server/pages/IceCreamDetailPage").then((module) => module.IceCreamDetailPage),
    pageTitle: "Ice Cream",
    helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [{ label: "Ice Creams", href: "/ice-creams" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
