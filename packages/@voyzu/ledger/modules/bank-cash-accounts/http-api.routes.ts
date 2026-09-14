import Type from "typebox";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { BankCashAccountResponseDto } from "./types/bank-cash-account.response.dto";
import { BankCashAccountUpdateRequestDto } from "./types/bank-cash-account.update.request.dto";
import { BankCashAccountPatchRequestDto } from "./types/bank-cash-account.patch.request.dto";
import { BankCashAccountCreateRequestDto } from "./types/bank-cash-account.create.request.dto";
import { BankCashAccountBatchPatchRequestDto } from "./types/bank-cash-account.batch-patch.request.dto";
import { BankCashAccountBatchUpdateRequestDto } from "./types/bank-cash-account.batch-update.request.dto";



export const httpApiRoutes = {
  "ledger.bank-cash-accounts.list": {
    description: "List Company Bank Cash Accounts.",
    method: "GET",
    path: "/ledger/[companyCode]/bank-cash-accounts",
    loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(BankCashAccountResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "ledger.bank-cash-accounts.filter": {
    description: "Filter Company Bank Cash Accounts.",
    method: "POST", path: "/ledger/[companyCode]/bank-cash-accounts/filter", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  "ledger.bank-cash-accounts.search": {
    description: "Search Company Bank Cash Accounts.",
    method: "GET", path: "/ledger/[companyCode]/bank-cash-accounts/search", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match bank cash account records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  "ledger.bank-cash-accounts.batchGet": {
    description: "Batch Get Company Bank Cash Accounts.",
    method: "POST", path: "/ledger/[companyCode]/bank-cash-accounts/batch/get", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  "ledger.bank-cash-accounts.batchCreate": {
    description: "Batch Create Company Bank Cash Accounts.",
    method: "POST", path: "/ledger/[companyCode]/bank-cash-accounts/batch/create", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(BankCashAccountCreateRequestDto) },
    summary: "Batch Create",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  "ledger.bank-cash-accounts.batchUpdate": {
    description: "Batch Update Company Bank Cash Accounts.",
    method: "PUT", path: "/ledger/[companyCode]/bank-cash-accounts/batch", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(BankCashAccountBatchUpdateRequestDto) },
    summary: "Batch Update",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  "ledger.bank-cash-accounts.batchPatch": {
    description: "Batch Patch Company Bank Cash Accounts.",
    method: "PATCH", path: "/ledger/[companyCode]/bank-cash-accounts/batch", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(BankCashAccountBatchPatchRequestDto) },
    summary: "Batch Patch",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  "ledger.bank-cash-accounts.batchDelete": {
    description: "Batch Delete Company Bank Cash Accounts.",
    method: "DELETE", path: "/ledger/[companyCode]/bank-cash-accounts/batch", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    
    
    responses: { "204": { description: "Successful response." } }
  },
  "ledger.bank-cash-accounts.create": {
    description: "Create Company Bank Cash Accounts.",
    method: "POST",
    path: "/ledger/[companyCode]/bank-cash-accounts",
    loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: BankCashAccountCreateRequestDto },
    summary: "Create",
    
    
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
  "ledger.bank-cash-accounts.get": {
    description: "Get Company Bank Cash Accounts.",
    method: "GET",
    path: "/ledger/[companyCode]/bank-cash-accounts/[code]",
    loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: BankCashAccountResponseDto
      },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "ledger.bank-cash-accounts.patch": {
    description: "Patch Company Bank Cash Accounts.",
    method: "PATCH",
    path: "/ledger/[companyCode]/bank-cash-accounts/[code]",
    loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: BankCashAccountPatchRequestDto },
    summary: "Patch",
    
    
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
  "ledger.bank-cash-accounts.update": {
    description: "Update Company Bank Cash Accounts.",
    method: "PUT", path: "/ledger/[companyCode]/bank-cash-accounts/[code]", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: BankCashAccountUpdateRequestDto },
    summary: "Update",
    
    
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  "ledger.bank-cash-accounts.delete": {
    description: "Delete Company Bank Cash Accounts.",
    method: "DELETE",
    path: "/ledger/[companyCode]/bank-cash-accounts/[code]",
    loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    
    
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "ledger.bank-cash-accounts.activate": {
    description: "Activate Company Bank Cash Accounts.",
    method: "POST", path: "/ledger/[companyCode]/bank-cash-accounts/[code]/activate", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    
    
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  "ledger.bank-cash-accounts.deactivate": {
    description: "Deactivate Company Bank Cash Accounts.",
    method: "POST", path: "/ledger/[companyCode]/bank-cash-accounts/[code]/deactivate", loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    
    
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  "ledger.bank-cash-accounts.batchActivate": {
    description: "Batch Activate Company Bank Cash Accounts.",
    method: "POST",
    path: "/ledger/[companyCode]/bank-cash-accounts/batch-activate",
    loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    
    
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
  "ledger.bank-cash-accounts.batchDeactivate": {
    description: "Batch Deactivate Company Bank Cash Accounts.",
    method: "POST",
    path: "/ledger/[companyCode]/bank-cash-accounts/batch-deactivate",
    loadHandler: () => import("./server/http-api/bank-cash-account.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    
    
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
