import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import {
  handleAllTemplatesReport,
} from "./server";
import { AllTemplatesReportPage } from "./server/pages/AllTemplatesReportPage";

export const templateReportsModule = {
  pageRoutes: {
    all: {
      id: "voyzu.template.reports.page.all",
      path: "/template/reports/all",
      Page: AllTemplatesReportPage,
      pageTitle: "Template Report",
      helpPath: "voyzu-platform-patterns/pdf-generation",
      breadcrumbBase: [
        { label: "Template", href: "/template" },
        { label: "Reports" },
      ],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
    allPrintable: {
      id: "voyzu.template.reports.page.all.printable",
      path: "/template/reports/all/printable",
      Page: AllTemplatesReportPage,
      pageTitle: "Template Report",
      helpPath: "voyzu-platform-patterns/pdf-generation",
      unframed: true,
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
  },
  apiDefinitions: {
    all: {
      method: "GET",
      path: "/template/reports/all-template",
      handler: (request: any) => handleAllTemplatesReport(request),
      apiDoc: {
        summary: "All Templates Report",
        description: "Returns every template for reporting.",
        tags: ["Template Reports"],
        responses: {
          "200": {
            description: "All templates in report form.",
            schema: arrayOf(dtoRef("TemplateReportRowDto")),
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

export default templateReportsModule;
