import {
  ForbiddenErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from "@voyzu/types";
import Type from "typebox";
import { IceCreamReportRowDto } from "@voyzu/ice-creams/types";

const loadHandlers = () => import("./server/http-api/ice-cream-report.http.handlers");

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

export const httpApiRoutes = {
  "ice-creams.reports.all": {
    description: "Returns every ice cream for reporting.",
    method: "GET",
    path: "/ice-creams/reports/all-ice-creams",
    loadHandler: () => loadHandlers().then((module) => module.handleAllIceCreamsReport),
    summary: "All Ice Creams Report",
    
    
    responses: {
      ...commonResponses,
      "200": {
        description: "All ice creams in report form.",
        body: Type.Array(IceCreamReportRowDto),
      },
    }
  },
} as const;
