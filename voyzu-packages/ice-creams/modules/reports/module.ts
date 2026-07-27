import { arrayOf, dtoRef } from "@voyzu/types/api";
import {
  AllIceCreamsReportPage,
  handleAllIceCreamsReport,
} from "./server";

export const iceCreamReportsModule = {
  id: "voyzu-packages.ice-creams.reports",
  name: "Ice Cream Reports",
  pageRoutes: {
    all: {
      id: "voyzu-packages.ice-creams.reports.page.all",
      pageTitle: "All Ice Creams",
      helpUrl: "packages/ice-creams/reports/all",
    },
    allPrintable: {
      id: "voyzu-packages.ice-creams.reports.page.all.printable",
      pageTitle: "All Ice Creams",
      helpUrl: "packages/ice-creams/reports/all",
    },
  },
  apiDefinitions: {
    all: {
      method: "GET",
      path: "/ice-creams/reports/all",
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
  pages: {
    all: AllIceCreamsReportPage,
  },
} as const;

export default iceCreamReportsModule;
