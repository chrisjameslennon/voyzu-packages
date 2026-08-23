import Type from "typebox";
import { handleActivate as handleActivateFinancialDocumentDefault, handleBatchActivate as handleBatchActivateFinancialDocumentDefaults, handleBatchCreate as handleBatchCreateFinancialDocumentDefaults, handleBatchDeactivate as handleBatchDeactivateFinancialDocumentDefaults, handleBatchDelete as handleBatchDeleteFinancialDocumentDefaults, handleBatchGet as handleBatchGetFinancialDocumentDefaults, handleBatchPatch as handleBatchPatchFinancialDocumentDefaults, handleBatchUpdate as handleBatchUpdateFinancialDocumentDefaults, handleCreate as handleCreateFinancialDocumentDefault, handleDeactivate as handleDeactivateFinancialDocumentDefault, handleDelete as handleDeleteFinancialDocumentDefault, handleFilter as handleFilterFinancialDocumentDefaults, handleGet as handleGetFinancialDocumentDefault, handleList as handleListFinancialDocumentDefaults, handlePatch as handlePatchFinancialDocumentDefault, handleSearch as handleSearchFinancialDocumentDefaults, handleUpdate as handleUpdateFinancialDocumentDefault } from "@voyzu/finance/common/financial-document-defaults/server";
import { CompanyFinancialDocumentDefaultsListPage, CompanyFinancialDocumentDefaultDetailPage } from "@voyzu/finance/company-financial-document-defaults/server";
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
    handler: (request: any) => handleListFinancialDocumentDefaults(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: { "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) } }
  },
  filter: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/filter",
    handler: (request: any) => handleFilterFinancialDocumentDefaults(request),
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
    handler: (request: any) => handleSearchFinancialDocumentDefaults(request),
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
    handler: (request: any) => handleCreateFinancialDocumentDefault(request),
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
    handler: (request: any) => handleBatchCreateFinancialDocumentDefaults(request),
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
    handler: (request: any) => handleBatchGetFinancialDocumentDefaults(request),
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
    handler: (request: any) => handleBatchUpdateFinancialDocumentDefaults(request),
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
    handler: (request: any) => handleBatchPatchFinancialDocumentDefaults(request),
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
    handler: (request: any) => handleBatchDeleteFinancialDocumentDefaults(request),
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
    handler: (request: any) => handleBatchActivateFinancialDocumentDefaults(request),
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
    handler: (request: any) => handleBatchDeactivateFinancialDocumentDefaults(request),
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
    handler: (request: any, context: any) => handleGetFinancialDocumentDefault(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: { "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    handler: (request: any, context: any) => handleUpdateFinancialDocumentDefault(request, context),
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
    handler: (request: any, context: any) => handlePatchFinancialDocumentDefault(request, context),
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
    handler: (request: any, context: any) => handleDeleteFinancialDocumentDefault(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company Financial Document Defaults.",
    tags: ["Company Financial Document Defaults"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  activate: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/[code]/activate",
    handler: (request: any, context: any) => handleActivateFinancialDocumentDefault(request, context),
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
    handler: (request: any, context: any) => handleDeactivateFinancialDocumentDefault(request, context),
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
