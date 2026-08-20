import { IceCreamDetailPage } from "./server/pages/IceCreamDetailPage";
import { IceCreamsListPage } from "./server/pages/IceCreamsListPage";

export const pageRoutes = {
  list: {
    id: "voyzu.ice-creams.page.list",
    path: "/ice-creams",
    Page: IceCreamsListPage,
    pageTitle: "Ice Creams",
    helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
  detail: {
    id: "voyzu.ice-creams.page.detail",
    path: "/ice-creams/[code]",
    Page: IceCreamDetailPage,
    pageTitle: "Ice Cream",
    helpPath: "voyzu-platform-guide/develop-a-new-package",
    breadcrumbBase: [{ label: "Ice Creams", href: "/ice-creams" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
} as const;
