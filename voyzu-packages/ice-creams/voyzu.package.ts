import {
  IceCreamAuditEventDetailPage,
  IceCreamAuditEventsPage,
} from "./modules/audit/server";
import {
  IceCreamDetailPage,
  IceCreamsListPage,
} from "./modules/ice-creams/server";
import { AllIceCreamsReportPage } from "./modules/reports/server";
import { iceCreamsModule } from "./module";
import { iceCreamsLeftNav } from "./navigation/left-nav.leftnav";
import { iceCreamsTopNav } from "./navigation/top-nav.topnav";

/**
 * Golden Voyzu package manifest.
 *
 * This deliberately uses the new package structure. The installer and composer
 * will be updated separately to consume this contract.
 */
export const iceCreamsPackage = {
  schemaVersion: 1,
  id: "voyzu-packages.ice-creams",
  name: "Ice Creams",
  version: "0.1.0",
  description: "A best-practice, self-contained ice-cream management package.",
  dependencies: {
    voyzu: ["audit"],
    packages: [],
  },
  modules: [iceCreamsModule],
  navigation: {
    top: iceCreamsTopNav,
    left: iceCreamsLeftNav,
  },
  surface: {
    routes: [
      {
        ...iceCreamsModule.pageRoutes.list,
        path: "/ice-creams",
        Page: IceCreamsListPage,
        breadcrumbBase: [],
        auth: { required: true, minRole: "ORGANIZATION_USER" },
      },
      {
        ...iceCreamsModule.pageRoutes.reportAll,
        path: "/ice-creams/reports/all",
        Page: AllIceCreamsReportPage,
        breadcrumbBase: [
          { label: "Ice Creams", href: "/ice-creams" },
          { label: "Reports" },
        ],
        auth: { required: true, minRole: "ORGANIZATION_USER" },
      },
      {
        ...iceCreamsModule.pageRoutes.reportAllPrintable,
        path: "/ice-creams/reports/all/printable",
        Page: AllIceCreamsReportPage,
        unframed: true,
        auth: { required: true, minRole: "ORGANIZATION_USER" },
      },
      {
        ...iceCreamsModule.pageRoutes.auditList,
        path: "/ice-creams/audit",
        Page: IceCreamAuditEventsPage,
        breadcrumbBase: [
          { label: "Ice Creams", href: "/ice-creams" },
        ],
        auth: { required: true, minRole: "ORGANIZATION_USER" },
      },
      {
        ...iceCreamsModule.pageRoutes.detail,
        path: "/ice-creams/[code]",
        Page: IceCreamDetailPage,
        breadcrumbBase: [
          { label: "Ice Creams", href: "/ice-creams" },
        ],
        auth: { required: true, minRole: "ORGANIZATION_USER" },
      },
      {
        ...iceCreamsModule.pageRoutes.auditDetail,
        path: "/ice-creams/audit/[id]",
        Page: IceCreamAuditEventDetailPage,
        breadcrumbBase: [
          { label: "Ice Creams", href: "/ice-creams" },
          { label: "Audit Log", href: "/ice-creams/audit" },
        ],
        auth: { required: true, minRole: "ORGANIZATION_USER" },
      },
    ],
  },
  install: {
    sql: [
      "./install/db/sql/001-ice-cream-flavor.sql",
      "./install/db/sql/002-ice-cream.sql",
    ],
    seedSql: [
      "./install/db/seed/001-ice-cream-flavor.seed.sql",
    ],
  },
  scripts: {
    sampleData: "./scripts/sample-data/install.ts",
    uninstall: "./scripts/uninstall/uninstall.ts",
  },
} as const;

export default iceCreamsPackage;
