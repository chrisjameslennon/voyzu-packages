import Type from "typebox";
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
    path: "/finance/[companyCode]/bank-cash-accounts",
    loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(BankCashAccountResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  filter: {
    method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/filter", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  search: {
    method: "GET", path: "/finance/[companyCode]/bank-cash-accounts/search", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match bank cash account records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchGet: {
    method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/batch/get", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchCreate: {
    method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/batch/create", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(BankCashAccountCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchUpdate: {
    method: "PUT", path: "/finance/[companyCode]/bank-cash-accounts/batch", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(BankCashAccountBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchPatch: {
    method: "PATCH", path: "/finance/[companyCode]/bank-cash-accounts/batch", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(BankCashAccountBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: Type.Array(BankCashAccountResponseDto) } }
  },
  batchDelete: {
    method: "DELETE", path: "/finance/[companyCode]/bank-cash-accounts/batch", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "204": { description: "Successful response." } }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/bank-cash-accounts",
    loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: BankCashAccountCreateRequestDto },
    summary: "Create",
    description: "Create Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
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
    path: "/finance/[companyCode]/bank-cash-accounts/[code]",
    loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
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
    path: "/finance/[companyCode]/bank-cash-accounts/[code]",
    loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: BankCashAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
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
    method: "PUT", path: "/finance/[companyCode]/bank-cash-accounts/[code]", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: BankCashAccountUpdateRequestDto },
    summary: "Update",
    description: "Update Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  delete: {
    method: "DELETE",
    path: "/finance/[companyCode]/bank-cash-accounts/[code]",
    loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/[code]/activate", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  deactivate: {
    method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/[code]/deactivate", loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
    responses: { "200": { description: "Successful response.", body: BankCashAccountResponseDto } }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/[companyCode]/bank-cash-accounts/batch-activate",
    loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
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
    path: "/finance/[companyCode]/bank-cash-accounts/batch-deactivate",
    loadHandler: () => import("../common/bank-cash-accounts/server/api/bank-cash-account.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Company Bank Cash Accounts.",
    tags: ["Company Bank Cash Accounts"],
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
