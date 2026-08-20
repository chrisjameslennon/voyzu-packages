import {
  IceCreamAuditEventDetailPage,
  IceCreamAuditEventsPage,
} from "./server/pages/IceCreamAuditPages";

export const pageRoutes = {
  list: {
    id: "voyzu.ice-creams.audit.page.list",
    path: "/ice-creams/audit",
    Page: IceCreamAuditEventsPage,
    pageTitle: "Ice Cream Audit Log",
    helpPath: "voyzu-platform-patterns/auditing-patterns",
    breadcrumbBase: [{ label: "Ice Creams" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
  detail: {
    id: "voyzu.ice-creams.audit.page.detail",
    path: "/ice-creams/audit/[id]",
    Page: IceCreamAuditEventDetailPage,
    pageTitle: "Ice Cream Audit Event",
    helpPath: "voyzu-platform-patterns/auditing-patterns",
    breadcrumbBase: [
      { label: "Ice Creams" },
      { label: "Audit Log", href: "/ice-creams/audit" },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
} as const;
