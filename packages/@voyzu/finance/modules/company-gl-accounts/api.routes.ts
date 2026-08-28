import Type from "typebox";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { GlAccountResponseDto } from "../../types/modules/gl-accounts/gl-account.response.dto";
import { GlAccountPatchRequestDto } from "../../types/modules/gl-accounts/gl-account.patch.request.dto";
import { GlAccountUpdateRequestDto } from "../../types/modules/gl-accounts/gl-account.update.request.dto";
import { GlAccountBatchPatchRequestDto } from "../../types/modules/gl-accounts/gl-account.batch-patch.request.dto";
import { GlAccountBatchUpdateRequestDto } from "../../types/modules/gl-accounts/gl-account.batch-update.request.dto";
import { GlAccountCreateRequestDto } from "../../types/modules/gl-accounts/gl-account.create.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/gl-accounts",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(GlAccountResponseDto) } }
  },
  filter: {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/filter",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  search: {
    method: "GET",
    path: "/finance/[companyCode]/gl-accounts/search",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company GL account records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCreateRequestDto },
    summary: "Create",
    description: "Create Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/batch",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchGet: {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/batch/get",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchUpdate: {
    method: "PUT",
    path: "/finance/[companyCode]/gl-accounts/batch",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchPatch: {
    method: "PATCH",
    path: "/finance/[companyCode]/gl-accounts/batch",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDelete: {
    method: "DELETE",
    path: "/finance/[companyCode]/gl-accounts/batch",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "204": { description: "Successful response." },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/batch-activate",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDeactivate: {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/batch-deactivate",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/[code]/activate",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": { description: "Successful response.", body: GlAccountResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deactivate: {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/[code]/deactivate",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": { description: "Successful response.", body: GlAccountResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/gl-accounts/[code]",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: { "200": { description: "Successful response.", body: GlAccountResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/[companyCode]/gl-accounts/[code]",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountUpdateRequestDto },
    summary: "Update",
    description: "Update Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/[companyCode]/gl-accounts/[code]",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  delete: {
    method: "DELETE",
    path: "/finance/[companyCode]/gl-accounts/[code]",
    loadHandler: () => import("../common/gl-accounts/server/api/gl-account.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company GL Accounts.",
    tags: ["Company GL Accounts"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
