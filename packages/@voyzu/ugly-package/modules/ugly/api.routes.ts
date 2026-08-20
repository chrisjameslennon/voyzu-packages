import {
  ForbiddenErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from "@voyzu/types";
import { RawRequestResponseDto } from "../types";
import { handleRawRequestResponse } from "./server/api/raw-request-response.http.handlers";

export const apiDefinitions = {
  rawRequestResponse: {
    method: "GET",
    path: "/ugly-package/raw-request-response",
    handler: handleRawRequestResponse,
    summary: "Raw Request / Response",
    description: "Returns a demonstration snapshot of the raw Next.js request and response.",
    tags: ["Ugly Package"],
    responses: {
      "200": {
        description: "The request and response demonstration snapshot.",
        body: RawRequestResponseDto,
      },
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
    },
  },
} as const;
