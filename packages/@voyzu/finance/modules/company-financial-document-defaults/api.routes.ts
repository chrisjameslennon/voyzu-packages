import Type from "typebox";
import { BusinessRuleErrorResponseDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialDocumentDefaultResponseDto } from "../../types/modules/financial-document-defaults/financial-document-default.response.dto";
import { FinancialDocumentDefaultPatchRequestDto } from "../../types/modules/financial-document-defaults/financial-document-default.patch.request.dto";
import { FinancialDocumentDefaultUpdateRequestDto } from "../../types/modules/financial-document-defaults/financial-document-default.update.request.dto";
import { FinancialDocumentDefaultKeysRequestDto } from "../common/financial-document-defaults/types/financial-document-default-keys.request.dto";
import { FinancialDocumentDefaultBatchPatchRequestDto } from "../../types/modules/financial-document-defaults/financial-document-default.batch-patch.request.dto";
import { FinancialDocumentDefaultBatchUpdateRequestDto } from "../../types/modules/financial-document-defaults/financial-document-default.batch-update.request.dto";
import { FinancialDocumentDefaultCreateRequestDto } from "../../types/modules/financial-document-defaults/financial-document-default.create.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-defaults",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: { "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) } }
  },
  filter: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/filter",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  search: {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-defaults/search",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company financial document default records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultCreateRequestDto },
    summary: "Create",
    description: "Create Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialDocumentDefaultResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/batch",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(FinancialDocumentDefaultCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchGet: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/batch/get",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchUpdate: {
    method: "PUT",
    path: "/finance/[companyCode]/financial-document-defaults/batch",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(FinancialDocumentDefaultBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchPatch: {
    method: "PATCH",
    path: "/finance/[companyCode]/financial-document-defaults/batch",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(FinancialDocumentDefaultBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDelete: {
    method: "DELETE",
    path: "/finance/[companyCode]/financial-document-defaults/batch",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/batch/activate",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDeactivate: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/batch/deactivate",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: { "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultUpdateRequestDto },
    summary: "Update",
    description: "Update Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialDocumentDefaultResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultPatchRequestDto },
    summary: "Patch",
    description: "Patch Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialDocumentDefaultResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  delete: {
    method: "DELETE",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  activate: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/[code]/activate",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deactivate: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/[code]/deactivate",
    loadHandler: () => import("../common/financial-document-defaults/server/api/financial-document-default.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
