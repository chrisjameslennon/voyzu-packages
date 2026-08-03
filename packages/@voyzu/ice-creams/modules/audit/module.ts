import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import {
  IceCreamAuditEventDetailPage,
  IceCreamAuditEventsPage,
} from "./server/pages/IceCreamAuditPages";

export const iceCreamAuditModule = {
  pageRoutes: {
    list: {
      id: "voyzu.ice-creams.audit.page.list",
      path: "/ice-creams/audit",
      Page: IceCreamAuditEventsPage,
      pageTitle: "Ice Cream Audit Log",
      helpPath: "packages/ice-creams/audit",
      breadcrumbBase: [{ label: "Ice Creams", href: "/ice-creams" }],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
    detail: {
      id: "voyzu.ice-creams.audit.page.detail",
      path: "/ice-creams/audit/[id]",
      Page: IceCreamAuditEventDetailPage,
      pageTitle: "Ice Cream Audit Event",
      helpPath: "packages/ice-creams/audit",
      breadcrumbBase: [
        { label: "Ice Creams", href: "/ice-creams" },
        { label: "Audit Log", href: "/ice-creams/audit" },
      ],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
  },
  apiDefinitions: {},
} as const satisfies VoyzuPackageModuleDefinition;

export default iceCreamAuditModule;
