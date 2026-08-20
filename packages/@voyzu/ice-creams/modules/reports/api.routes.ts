import {
  ForbiddenErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from "@voyzu/types";
import Type from "typebox";
import { IceCreamReportRowDto } from "../types";
import {
  handleAllIceCreamsReport,
} from "./server";

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

export const apiDefinitions = {
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
} as const;
