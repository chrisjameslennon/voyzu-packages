import {
  ForbiddenErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from "@voyzu/types";
import Type from "typebox";
import { TemplateReportRowDto } from "../types";

const loadHandlers = () => import("./server/api/template-report.http.handlers");

export const apiDefinitions = {
  all: {
    method: "GET",
    path: "/template/reports/all-template",
    loadHandler: () => loadHandlers().then((module) => module.handleAllTemplatesReport),
    summary: "All Templates Report",
    description: "Returns every template for reporting.",
    tags: ["Template Reports"],
    responses: {
      "200": { description: "All templates in report form.", body: Type.Array(TemplateReportRowDto) },
      "401": { description: "Authentication failed.", body: UnauthorizedErrorResponseDto },
      "403": { description: "Access is forbidden.", body: ForbiddenErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    },
  },
} as const;
