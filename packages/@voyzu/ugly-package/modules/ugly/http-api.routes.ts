import {
  ForbiddenErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from "@voyzu/types";
import { RawRequestResponseDto } from "@voyzu/ugly-package/types";

const loadHandlers = () => import("./server/http-api/raw-request-response.http.handlers");

export const httpApiRoutes = {
  "ugly-package.ugly.rawRequestResponse": {
    method: "GET",
    path: "/ugly-package/raw-request-response",
    loadHandler: () => loadHandlers().then((module) => module.handleRawRequestResponse),
    summary: "Raw Request / Response",
    
    
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
