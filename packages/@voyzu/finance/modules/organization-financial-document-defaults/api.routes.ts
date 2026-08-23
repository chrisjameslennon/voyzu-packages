import Type from "typebox";
import { handleActivate as handleFinancialDocumentDefaultsActivate, handleBatchActivate as handleFinancialDocumentDefaultsBatchActivate, handleBatchCreate as handleFinancialDocumentDefaultsBatchCreate, handleBatchDeactivate as handleFinancialDocumentDefaultsBatchDeactivate, handleBatchDelete as handleFinancialDocumentDefaultsBatchDelete, handleBatchGet as handleFinancialDocumentDefaultsBatchGet, handleBatchPatch as handleFinancialDocumentDefaultsBatchPatch, handleBatchUpdate as handleFinancialDocumentDefaultsBatchUpdate, handleCreate as handleFinancialDocumentDefaultsCreate, handleDeactivate as handleFinancialDocumentDefaultsDeactivate, handleDelete as handleFinancialDocumentDefaultsDelete, handleFilter as handleFinancialDocumentDefaultsFilter, handleGet as handleFinancialDocumentDefaultsGet, handleList as handleFinancialDocumentDefaultsList, handlePatch as handleFinancialDocumentDefaultsPatch, handleSearch as handleFinancialDocumentDefaultsSearch, handleUpdate as handleFinancialDocumentDefaultsUpdate } from "@voyzu/finance/common/financial-document-defaults/server";
import { OrganizationFinancialDocumentDefaultsListPage, OrganizationFinancialDocumentDefaultDetailPage } from "@voyzu/finance/organization-financial-document-defaults/server";
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
    path: "/finance/financial-document-defaults",
    handler: (request: any) => handleFinancialDocumentDefaultsList(request),
    summary: "List",
    description: "List Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: { "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) } }
  },
  create: {
    method: "POST",
    path: "/finance/financial-document-defaults",
    handler: (request: any) => handleFinancialDocumentDefaultsCreate(request),
    request: { contentType: "application/json", body: FinancialDocumentDefaultCreateRequestDto },
    summary: "Create",
    description: "Create Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
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
  filter: {
    method: "POST",
    path: "/finance/financial-document-defaults/filter",
    handler: (request: any) => handleFinancialDocumentDefaultsFilter(request),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
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
    path: "/finance/financial-document-defaults/search",
    handler: (request: any) => handleFinancialDocumentDefaultsSearch(request),
    request: { query: { parameters: { q: { description: "Search text used to match organization financial document default records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/financial-document-defaults/batch/create",
    handler: (request: any) => handleFinancialDocumentDefaultsBatchCreate(request),
    request: { contentType: "application/json", body: Type.Array(FinancialDocumentDefaultCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
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
    path: "/finance/financial-document-defaults/batch/get",
    handler: (request: any) => handleFinancialDocumentDefaultsBatchGet(request),
    request: { contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
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
    path: "/finance/financial-document-defaults/batch/update",
    handler: (request: any) => handleFinancialDocumentDefaultsBatchUpdate(request),
    request: { contentType: "application/json", body: Type.Array(FinancialDocumentDefaultBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
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
    path: "/finance/financial-document-defaults/batch/patch",
    handler: (request: any) => handleFinancialDocumentDefaultsBatchPatch(request),
    request: { contentType: "application/json", body: Type.Array(FinancialDocumentDefaultBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
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
    method: "POST",
    path: "/finance/financial-document-defaults/batch/delete",
    handler: (request: any) => handleFinancialDocumentDefaultsBatchDelete(request),
    request: { contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/financial-document-defaults/batch/activate",
    handler: (request: any) => handleFinancialDocumentDefaultsBatchActivate(request),
    request: { contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDeactivate: {
    method: "POST",
    path: "/finance/financial-document-defaults/batch/deactivate",
    handler: (request: any) => handleFinancialDocumentDefaultsBatchDeactivate(request),
    request: { contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/financial-document-defaults/[code]",
    handler: (request: any, context: any) => handleFinancialDocumentDefaultsGet(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: { "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/financial-document-defaults/[code]",
    handler: (request: any, context: any) => handleFinancialDocumentDefaultsUpdate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultUpdateRequestDto },
    summary: "Update",
    description: "Update Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
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
    path: "/finance/financial-document-defaults/[code]",
    handler: (request: any, context: any) => handleFinancialDocumentDefaultsPatch(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
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
    path: "/finance/financial-document-defaults/[code]",
    handler: (request: any, context: any) => handleFinancialDocumentDefaultsDelete(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  activate: {
    method: "POST",
    path: "/finance/financial-document-defaults/[code]/activate",
    handler: (request: any, context: any) => handleFinancialDocumentDefaultsActivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deactivate: {
    method: "POST",
    path: "/finance/financial-document-defaults/[code]/deactivate",
    handler: (request: any, context: any) => handleFinancialDocumentDefaultsDeactivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization Financial Document Defaults.",
    tags: ["Organization Financial Document Defaults"],
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
