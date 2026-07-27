import { iceCreamAuditModule } from "./modules/audit/module";
import { iceCreamsModule as iceCreamCrudModule } from "./modules/ice-creams/module";
import { iceCreamReportsModule } from "./modules/reports/module";

/**
 * The single installable module exposed by the Ice Creams package.
 *
 * Feature folders own their implementations, while this top-level declaration
 * is the authoritative registry consumed by Voyzu composition.
 */
export const iceCreamsModule = {
  id: "voyzu-packages.ice-creams",
  name: "Ice Creams",
  pageRoutes: {
    list: iceCreamCrudModule.pageRoutes.list,
    detail: iceCreamCrudModule.pageRoutes.detail,
    reportAll: iceCreamReportsModule.pageRoutes.all,
    reportAllPrintable: iceCreamReportsModule.pageRoutes.allPrintable,
    auditList: iceCreamAuditModule.pageRoutes.list,
    auditDetail: iceCreamAuditModule.pageRoutes.detail,
  },
  apiDefinitions: {
    ...iceCreamCrudModule.apiDefinitions,
    reportAll: iceCreamReportsModule.apiDefinitions.all,
    auditList: iceCreamAuditModule.apiDefinitions.list,
    auditCount: iceCreamAuditModule.apiDefinitions.count,
    auditExport: iceCreamAuditModule.apiDefinitions.export,
    auditGet: iceCreamAuditModule.apiDefinitions.get,
  },
} as const;

export default iceCreamsModule;
