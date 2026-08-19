import Type from "typebox";
import {
  ForbiddenErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from "@voyzu/types";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { IceCreamReportRowDto } from "../types";
import {
  handleAllIceCreamsReport,
} from "./server";
import { AllIceCreamsReportPage } from "./server/pages/AllIceCreamsReportPage";

const apiDocsUrl = "/api-reference/@voyzu-ice-creams/ice-cream-reports";
const commonResponses = {
  "401": {
    description: "Authentication failed.",
    body: UnauthorizedErrorResponseDto,
  },
  "403": {
    description: "Access is forbidden.",
    body: ForbiddenErrorResponseDto,
  },
  "500": {
    description: "An unexpected server error occurred.",
    body: InternalServerErrorResponseDto,
  },
} as const;

export const iceCreamReportsModule = {
  pageRoutes: {
    all: {
      id: "voyzu.ice-creams.reports.page.all",
      path: "/ice-creams/reports/all",
      Page: AllIceCreamsReportPage,
      pageTitle: "All Ice Creams",
      helpPath: "voyzu-platform-patterns/pdf-generation",
      breadcrumbBase: [
        { label: "Ice Creams" },
        { label: "Reports" },
      ],
      apiDocsUrl,
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
    allPrintable: {
      id: "voyzu.ice-creams.reports.page.all.printable",
      path: "/ice-creams/reports/all/printable",
      Page: AllIceCreamsReportPage,
      pageTitle: "All Ice Creams",
      helpPath: "voyzu-platform-patterns/pdf-generation",
      unframed: true,
      apiDocsUrl,
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
  },
  apiDefinitions: {
    all: {
      method: "GET",
      path: "/ice-creams/reports/all-ice-creams",
      handler: (request: any) => handleAllIceCreamsReport(request),
      summary: "All Ice Creams Report",
      description: "Returns every ice cream for reporting.",
      tags: ["Ice Cream Reports"],
      responses: {
        ...commonResponses,
        "200": {
          description: "All ice creams in report form.",
          body: Type.Array(IceCreamReportRowDto),
        },
      }
    },
  },
} as const satisfies VoyzuPackageModuleDefinition;

export default iceCreamReportsModule;
