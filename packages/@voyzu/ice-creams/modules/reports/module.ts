import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import {
  handleAllIceCreamsReport,
} from "./server";
import { AllIceCreamsReportPage } from "./server/pages/AllIceCreamsReportPage";

export const iceCreamReportsModule = {
  pageRoutes: {
    all: {
      id: "voyzu.ice-creams.reports.page.all",
      path: "/ice-creams/reports/all",
      Page: AllIceCreamsReportPage,
      pageTitle: "All Ice Creams",
      helpUrl: "packages/ice-creams/reports/all",
      breadcrumbBase: [
        { label: "Ice Creams", href: "/ice-creams" },
        { label: "Reports" },
      ],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
    allPrintable: {
      id: "voyzu.ice-creams.reports.page.all.printable",
      path: "/ice-creams/reports/all/printable",
      Page: AllIceCreamsReportPage,
      pageTitle: "All Ice Creams",
      helpUrl: "packages/ice-creams/reports/all",
      unframed: true,
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
  },
  apiDefinitions: {
    all: {
      method: "GET",
      path: "/ice-cream-reports/all-ice-creams",
      handler: (request: any) => handleAllIceCreamsReport(request),
      apiDoc: {
        summary: "All Ice Creams Report",
        description: "Returns every ice cream for reporting.",
        tags: ["Ice Cream Reports"],
        responses: {
          "200": {
            description: "All ice creams in report form.",
            schema: arrayOf(dtoRef("IceCreamReportRowDto")),
          },
          "500": {
            description: "An unexpected server error occurred.",
            schema: dtoRef("InternalServerErrorResponseDto"),
          },
        },
      },
    },
  },
} as const satisfies VoyzuPackageModuleDefinition;

export default iceCreamReportsModule;
