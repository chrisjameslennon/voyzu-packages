import {
  CompanyAccessPageDto,
  CompanyAccessUpdateRequestDto,
  CompanyAccessUserDto,
} from "@voyzu/erp-core/types/modules/company-access";
import {
  BusinessRuleErrorResponseDto,
  ForbiddenErrorResponseDto,
  InputValidationErrorResponseDto,
  InternalServerErrorResponseDto,
  EntityNotFoundErrorResponseDto,
} from "@voyzu/types";

import { handleList, handleReplace } from "./server/api/company-access.http.handlers";

export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/organization/company-access",
    handler: handleList,
    summary: "List company access",
    description: "Lists standard users, companies and current company assignments.",
    tags: ["Company Access"],
    responses: {
      "200": { description: "Company access configuration.", body: CompanyAccessPageDto },
      "403": { description: "Access is forbidden.", body: ForbiddenErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    },
  },
  replace: {
    method: "PUT",
    path: "/organization/company-access/[code]",
    handler: handleReplace,
    request: {
      path: {
        code: {
          description: "User code.",
          schema: { type: "string" },
        },
      },
      contentType: "application/json",
      body: CompanyAccessUpdateRequestDto,
    },
    summary: "Replace company access",
    description: "Replaces all company assignments for a standard user.",
    tags: ["Company Access"],
    responses: {
      "200": { description: "Updated company access.", body: CompanyAccessUserDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "403": { description: "Access is forbidden.", body: ForbiddenErrorResponseDto },
      "404": { description: "User or company not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "The assignment violates a business rule.", body: BusinessRuleErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    },
  },
} as const;
