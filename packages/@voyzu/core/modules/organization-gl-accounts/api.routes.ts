import Type from "typebox";
import { handleActivate as handleGlAccountsActivate, handleBatchCreate as handleGlAccountsBatchCreate, handleBatchActivate as handleGlAccountsBatchActivate, handleBatchDeactivate as handleGlAccountsBatchDeactivate, handleBatchDelete as handleGlAccountsBatchDelete, handleBatchGet as handleGlAccountsBatchGet, handleBatchPatch as handleGlAccountsBatchPatch, handleBatchUpdate as handleGlAccountsBatchUpdate, handleCreate as handleGlAccountsCreate, handleDeactivate as handleGlAccountsDeactivate, handleDelete as handleGlAccountsDelete, handleFilter as handleGlAccountsFilter, handleGet as handleGlAccountsGet, handleList as handleGlAccountsList, handlePatch as handleGlAccountsPatch, handleSearch as handleGlAccountsSearch, handleUpdate as handleGlAccountsUpdate } from "@voyzu/core/common/gl-accounts/server";
import { OrganizationGlAccountsListPage, OrganizationGlAccountDetailPage } from "./server";
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
    path: "/finance/gl-accounts",
    handler: (request: any) => handleGlAccountsList(request),
    summary: "List",
    description: "List Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(GlAccountResponseDto) } }
  },
  create: {
    method: "POST",
    path: "/finance/gl-accounts",
    handler: (request: any) => handleGlAccountsCreate(request),
    request: { contentType: "application/json", body: GlAccountCreateRequestDto },
    summary: "Create",
    description: "Create Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
  filter: {
    method: "POST",
    path: "/finance/gl-accounts/filter",
    handler: (request: any) => handleGlAccountsFilter(request),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/search",
    handler: (request: any) => handleGlAccountsSearch(request),
    request: { query: { parameters: { q: { description: "Search text used to match organization GL account records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/gl-accounts/batch/create",
    handler: (request: any) => handleGlAccountsBatchCreate(request),
    request: { contentType: "application/json", body: Type.Array(GlAccountCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/batch/get",
    handler: (request: any) => handleGlAccountsBatchGet(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/batch/update",
    handler: (request: any) => handleGlAccountsBatchUpdate(request),
    request: { contentType: "application/json", body: Type.Array(GlAccountBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/batch/patch",
    handler: (request: any) => handleGlAccountsBatchPatch(request),
    request: { contentType: "application/json", body: Type.Array(GlAccountBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    method: "POST",
    path: "/finance/gl-accounts/batch/delete",
    handler: (request: any) => handleGlAccountsBatchDelete(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
    responses: {
      "204": { description: "Successful response." },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/gl-accounts/batch-activate",
    handler: (request: any) => handleGlAccountsBatchActivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/batch-deactivate",
    handler: (request: any) => handleGlAccountsBatchDeactivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/[code]/activate",
    handler: (request: any, context: any) => handleGlAccountsActivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
    responses: {
      "200": { description: "Successful response.", body: GlAccountResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deactivate: {
    method: "POST",
    path: "/finance/gl-accounts/[code]/deactivate",
    handler: (request: any, context: any) => handleGlAccountsDeactivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/[code]",
    handler: (request: any, context: any) => handleGlAccountsGet(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
    responses: { "200": { description: "Successful response.", body: GlAccountResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/gl-accounts/[code]",
    handler: (request: any, context: any) => handleGlAccountsUpdate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountUpdateRequestDto },
    summary: "Update",
    description: "Update Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/[code]",
    handler: (request: any, context: any) => handleGlAccountsPatch(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
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
    path: "/finance/gl-accounts/[code]",
    handler: (request: any, context: any) => handleGlAccountsDelete(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization GL Accounts.",
    tags: ["Organization GL Accounts"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
