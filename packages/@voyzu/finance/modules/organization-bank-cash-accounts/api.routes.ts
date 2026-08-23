import Type from "typebox";
import { handleActivate as handleBankCashAccountsActivate, handleBatchActivate as handleBankCashAccountsBatchActivate, handleBatchCreate as handleBankCashAccountsBatchCreate, handleBatchDeactivate as handleBankCashAccountsBatchDeactivate, handleBatchDelete as handleBankCashAccountsBatchDelete, handleBatchGet as handleBankCashAccountsBatchGet, handleBatchPatch as handleBankCashAccountsBatchPatch, handleBatchUpdate as handleBankCashAccountsBatchUpdate, handleCreate as handleBankCashAccountsCreate, handleDeactivate as handleBankCashAccountsDeactivate, handleDelete as handleBankCashAccountsDelete, handleFilter as handleBankCashAccountsFilter, handleGet as handleBankCashAccountsGet, handleList as handleBankCashAccountsList, handlePatch as handleBankCashAccountsPatch, handleSearch as handleBankCashAccountsSearch, handleUpdate as handleBankCashAccountsUpdate } from "@voyzu/finance/common/bank-cash-accounts/server";
import { OrganizationBankCashAccountsListPage, OrganizationBankCashAccountDetailPage } from "@voyzu/finance/organization-bank-cash-accounts/server";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { BankCashAccountResponseDto } from "../../types/modules/bank-cash-accounts/bank-cash-account.response.dto";
import { BankCashAccountUpdateRequestDto } from "../../types/modules/bank-cash-accounts/bank-cash-account.update.request.dto";
import { BankCashAccountPatchRequestDto } from "../../types/modules/bank-cash-accounts/bank-cash-account.patch.request.dto";
import { BankCashAccountCreateRequestDto } from "../../types/modules/bank-cash-accounts/bank-cash-account.create.request.dto";
import { BankCashAccountBatchPatchRequestDto } from "../../types/modules/bank-cash-accounts/bank-cash-account.batch-patch.request.dto";
import { BankCashAccountBatchUpdateRequestDto } from "../../types/modules/bank-cash-accounts/bank-cash-account.batch-update.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/bank-cash-accounts",
    handler: (request: any) => handleBankCashAccountsList(request),
    summary: "List",
    description: "List Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(BankCashAccountResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  filter: {
    method: "POST", path: "/finance/bank-cash-accounts/filter", handler: (request: any) => handleBankCashAccountsFilter(request),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  search: {
    method: "GET", path: "/finance/bank-cash-accounts/search", handler: (request: any) => handleBankCashAccountsSearch(request),
    request: { query: { parameters: { q: { description: "Search text used to match bank cash account records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchGet: {
    method: "POST", path: "/finance/bank-cash-accounts/batch/get", handler: (request: any) => handleBankCashAccountsBatchGet(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchCreate: {
    method: "POST", path: "/finance/bank-cash-accounts/batch/create", handler: (request: any) => handleBankCashAccountsBatchCreate(request),
    request: { contentType: "application/json", body: Type.Array(BankCashAccountCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchUpdate: {
    method: "PUT", path: "/finance/bank-cash-accounts/batch", handler: (request: any) => handleBankCashAccountsBatchUpdate(request),
    request: { contentType: "application/json", body: Type.Array(BankCashAccountBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchPatch: {
    method: "PATCH", path: "/finance/bank-cash-accounts/batch", handler: (request: any) => handleBankCashAccountsBatchPatch(request),
    request: { contentType: "application/json", body: Type.Array(BankCashAccountBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchDelete: {
    method: "DELETE", path: "/finance/bank-cash-accounts/batch", handler: (request: any) => handleBankCashAccountsBatchDelete(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "204": { description: "Successful response." } }
  },
  create: {
    method: "POST",
    path: "/finance/bank-cash-accounts",
    handler: (request: any) => handleBankCashAccountsCreate(request),
    request: { contentType: "application/json", body: BankCashAccountCreateRequestDto },
    summary: "Create",
    description: "Create Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: BankCashAccountResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/bank-cash-accounts/[code]",
    handler: (request: any, context: any) => handleBankCashAccountsGet(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: BankCashAccountResponseDto
      },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/bank-cash-accounts/[code]",
    handler: (request: any, context: any) => handleBankCashAccountsPatch(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: BankCashAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: BankCashAccountResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  update: {
    method: "PUT", path: "/finance/bank-cash-accounts/[code]", handler: (request: any, context: any) => handleBankCashAccountsUpdate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: BankCashAccountUpdateRequestDto },
    summary: "Update",
    description: "Update Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  delete: {
    method: "DELETE",
    path: "/finance/bank-cash-accounts/[code]",
    handler: (request: any, context: any) => handleBankCashAccountsDelete(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST", path: "/finance/bank-cash-accounts/[code]/activate", handler: (request: any, context: any) => handleBankCashAccountsActivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  deactivate: {
    method: "POST", path: "/finance/bank-cash-accounts/[code]/deactivate", handler: (request: any, context: any) => handleBankCashAccountsDeactivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/bank-cash-accounts/batch-activate",
    handler: (request: any) => handleBankCashAccountsBatchActivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(BankCashAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDeactivate: {
    method: "POST",
    path: "/finance/bank-cash-accounts/batch-deactivate",
    handler: (request: any) => handleBankCashAccountsBatchDeactivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Organization Bank Cash Accounts.",
    tags: ["Organization Bank Cash Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(BankCashAccountResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
