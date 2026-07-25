import { handleActivate as handleBankCashAccountsActivate, handleBatchActivate as handleBankCashAccountsBatchActivate, handleBatchCreate as handleBankCashAccountsBatchCreate, handleBatchDeactivate as handleBankCashAccountsBatchDeactivate, handleBatchDelete as handleBankCashAccountsBatchDelete, handleBatchGet as handleBankCashAccountsBatchGet, handleBatchPatch as handleBankCashAccountsBatchPatch, handleBatchUpdate as handleBankCashAccountsBatchUpdate, handleCreate as handleBankCashAccountsCreate, handleDeactivate as handleBankCashAccountsDeactivate, handleDelete as handleBankCashAccountsDelete, handleFilter as handleBankCashAccountsFilter, handleGet as handleBankCashAccountsGet, handleList as handleBankCashAccountsList, handlePatch as handleBankCashAccountsPatch, handleSearch as handleBankCashAccountsSearch, handleUpdate as handleBankCashAccountsUpdate } from "@voyzu/modules/common/bank-cash-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationBankCashAccountsModule = {
  id: "voyzu.organization-bank-cash-accounts",
  name: "Bank / Cash Accounts",
  pageRoutes: {
    list: {
      id: "voyzu.organization-bank-cash-accounts.page.list",
      pageTitle: "Bank / Cash Accounts",
      helpUrl: "modules-help/organization-financial-settings/bank-cash-accounts",
    },
    detail: {
      id: "voyzu.organization-bank-cash-accounts.page.detail",
      pageTitle: "Bank / Cash Account",
      helpUrl: "modules-help/organization-financial-settings/bank-cash-accounts",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/bank-cash-accounts",
      handler: (request: any) => handleBankCashAccountsList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Bank Cash Accounts.",
        tags: ["Organization Bank Cash Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("BankCashAccountResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    filter: { method: "POST", path: "/organization/bank-cash-accounts/filter", handler: (request: any) => handleBankCashAccountsFilter(request), apiDoc: { summary: "Filter", description: "Filter Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    search: { method: "GET", path: "/organization/bank-cash-accounts/search", handler: (request: any) => handleBankCashAccountsSearch(request), apiDoc: { summary: "Search", description: "Search Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], requestQuerystringParams: { q: { description: "Search text used to match bank cash account records.", schema: { type: "string" } } }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchGet: { method: "POST", path: "/organization/bank-cash-accounts/batch/get", handler: (request: any) => handleBankCashAccountsBatchGet(request), apiDoc: { summary: "Batch Get", description: "Batch Get Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchCreate: { method: "POST", path: "/organization/bank-cash-accounts/batch/create", handler: (request: any) => handleBankCashAccountsBatchCreate(request), apiDoc: { summary: "Batch Create", description: "Batch Create Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], requestBody: { required: true, schema: arrayOf(dtoRef("BankCashAccountCreateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchUpdate: { method: "PUT", path: "/organization/bank-cash-accounts/batch", handler: (request: any) => handleBankCashAccountsBatchUpdate(request), apiDoc: { summary: "Batch Update", description: "Batch Update Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], requestBody: { required: true, schema: arrayOf(dtoRef("BankCashAccountBatchUpdateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchPatch: { method: "PATCH", path: "/organization/bank-cash-accounts/batch", handler: (request: any) => handleBankCashAccountsBatchPatch(request), apiDoc: { summary: "Batch Patch", description: "Batch Patch Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], requestBody: { required: true, schema: arrayOf(dtoRef("BankCashAccountBatchPatchRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchDelete: { method: "DELETE", path: "/organization/bank-cash-accounts/batch", handler: (request: any) => handleBankCashAccountsBatchDelete(request), apiDoc: { summary: "Batch Delete", description: "Batch Delete Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Successful response." } } } },
    create: {
      method: "POST",
      path: "/organization/bank-cash-accounts",
      handler: (request: any) => handleBankCashAccountsCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Organization Bank Cash Accounts.",
        tags: ["Organization Bank Cash Accounts"],
        requestBody: { required: true, schema: dtoRef("BankCashAccountCreateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("BankCashAccountResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/organization/bank-cash-accounts/[code]",
      handler: (request: any, context: any) => handleBankCashAccountsGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization Bank Cash Accounts.",
        tags: ["Organization Bank Cash Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("BankCashAccountResponseDto")
          },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/bank-cash-accounts/[code]",
      handler: (request: any, context: any) => handleBankCashAccountsPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization Bank Cash Accounts.",
        tags: ["Organization Bank Cash Accounts"],
        requestBody: { required: true, schema: dtoRef("BankCashAccountPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("BankCashAccountResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    update: { method: "PUT", path: "/organization/bank-cash-accounts/[code]", handler: (request: any, context: any) => handleBankCashAccountsUpdate(request, context), apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Update", description: "Update Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], requestBody: { required: true, schema: dtoRef("BankCashAccountUpdateRequestDto") }, responses: { "200": { description: "Successful response.", schema: dtoRef("BankCashAccountResponseDto") } } } },
    delete: {
      method: "DELETE",
      path: "/organization/bank-cash-accounts/[code]",
      handler: (request: any, context: any) => handleBankCashAccountsDelete(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Organization Bank Cash Accounts.",
        tags: ["Organization Bank Cash Accounts"],
        responses: {
          "204": { description: "Successful response." },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: { method: "POST", path: "/organization/bank-cash-accounts/[code]/activate", handler: (request: any, context: any) => handleBankCashAccountsActivate(request, context), apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Activate", description: "Activate Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], responses: { "200": { description: "Successful response.", schema: dtoRef("BankCashAccountResponseDto") } } } },
    deactivate: { method: "POST", path: "/organization/bank-cash-accounts/[code]/deactivate", handler: (request: any, context: any) => handleBankCashAccountsDeactivate(request, context), apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Deactivate", description: "Deactivate Organization Bank Cash Accounts.", tags: ["Organization Bank Cash Accounts"], responses: { "200": { description: "Successful response.", schema: dtoRef("BankCashAccountResponseDto") } } } },
    batchActivate: {
      method: "POST",
      path: "/organization/bank-cash-accounts/batch-activate",
      handler: (request: any) => handleBankCashAccountsBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Batch Activate Organization Bank Cash Accounts.",
        tags: ["Organization Bank Cash Accounts"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("BankCashAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/organization/bank-cash-accounts/batch-deactivate",
      handler: (request: any) => handleBankCashAccountsBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Batch Deactivate Organization Bank Cash Accounts.",
        tags: ["Organization Bank Cash Accounts"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("BankCashAccountResponseDto"))
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
