export const pageRoutes = {
  list: {
    id: "voyzu.ice-creams.page.list",
    path: "/ice-creams",
    loadPage: () => import("./server/pages/IceCreamsListPage").then((module) => module.IceCreamsListPage),
    pageTitle: "Ice Creams",
    helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [],
    auth: { required: true, minRole: "STANDARD" },
  },
  detail: {
    id: "voyzu.ice-creams.page.detail",
    path: "/ice-creams/[code]",
    loadPage: () => import("./server/pages/IceCreamDetailPage").then((module) => module.IceCreamDetailPage),
    pageTitle: "Ice Cream",
    helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [{ label: "Ice Creams", href: "/ice-creams" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
