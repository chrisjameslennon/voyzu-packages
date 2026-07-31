import { handleActivate as handleActivateBankCashAccount, handleBatchActivate as handleBatchActivateBankCashAccounts, handleBatchCreate as handleBatchCreateBankCashAccounts, handleBatchDeactivate as handleBatchDeactivateBankCashAccounts, handleBatchDelete as handleBatchDeleteBankCashAccounts, handleBatchGet as handleBatchGetBankCashAccounts, handleBatchPatch as handleBatchPatchBankCashAccounts, handleBatchUpdate as handleBatchUpdateBankCashAccounts, handleCreate as handleCreateBankCashAccount, handleDeactivate as handleDeactivateBankCashAccount, handleDelete as handleDeleteBankCashAccount, handleFilter as handleFilterBankCashAccounts, handleGet as handleGetBankCashAccount, handleList as handleListBankCashAccounts, handlePatch as handlePatchBankCashAccount, handleSearch as handleSearchBankCashAccounts, handleUpdate as handleUpdateBankCashAccount } from "@voyzu-modules/core/common/bank-cash-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyBankCashAccountsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.company-bank-cash-accounts.page.list",
      pageTitle: "Bank / Cash Accounts",
      helpPath: "modules-help/company-ledger/bank-cash-accounts",
    },
    detail: {
      id: "voyzu.company-bank-cash-accounts.page.detail",
      pageTitle: "Bank / Cash Account",
      helpPath: "modules-help/company-ledger/bank-cash-accounts",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/bank-cash-accounts",
      handler: (request: any) => handleListBankCashAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Bank Cash Accounts.",
        tags: ["Company Bank Cash Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("BankCashAccountResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    filter: { method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/filter", handler: (request: any) => handleFilterBankCashAccounts(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Filter", description: "Filter Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    search: { method: "GET", path: "/finance/[companyCode]/bank-cash-accounts/search", handler: (request: any) => handleSearchBankCashAccounts(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Search", description: "Search Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], requestQuerystringParams: { q: { description: "Search text used to match bank cash account records.", schema: { type: "string" } } }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchGet: { method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/batch/get", handler: (request: any) => handleBatchGetBankCashAccounts(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Get", description: "Batch Get Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchCreate: { method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/batch/create", handler: (request: any) => handleBatchCreateBankCashAccounts(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Create", description: "Batch Create Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], requestBody: { required: true, schema: arrayOf(dtoRef("BankCashAccountCreateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchUpdate: { method: "PUT", path: "/finance/[companyCode]/bank-cash-accounts/batch", handler: (request: any) => handleBatchUpdateBankCashAccounts(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Update", description: "Batch Update Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], requestBody: { required: true, schema: arrayOf(dtoRef("BankCashAccountBatchUpdateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchPatch: { method: "PATCH", path: "/finance/[companyCode]/bank-cash-accounts/batch", handler: (request: any) => handleBatchPatchBankCashAccounts(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Patch", description: "Batch Patch Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], requestBody: { required: true, schema: arrayOf(dtoRef("BankCashAccountBatchPatchRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("BankCashAccountResponseDto")) } } } },
    batchDelete: { method: "DELETE", path: "/finance/[companyCode]/bank-cash-accounts/batch", handler: (request: any) => handleBatchDeleteBankCashAccounts(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Delete", description: "Batch Delete Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Successful response." } } } },
    create: {
      method: "POST",
      path: "/finance/[companyCode]/bank-cash-accounts",
      handler: (request: any) => handleCreateBankCashAccount(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Company Bank Cash Accounts.",
        tags: ["Company Bank Cash Accounts"],
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
      path: "/finance/[companyCode]/bank-cash-accounts/[code]",
      handler: (request: any, context: any) => handleGetBankCashAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company Bank Cash Accounts.",
        tags: ["Company Bank Cash Accounts"],
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
      path: "/finance/[companyCode]/bank-cash-accounts/[code]",
      handler: (request: any, context: any) => handlePatchBankCashAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company Bank Cash Accounts.",
        tags: ["Company Bank Cash Accounts"],
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
    update: { method: "PUT", path: "/finance/[companyCode]/bank-cash-accounts/[code]", handler: (request: any, context: any) => handleUpdateBankCashAccount(request, context), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Update", description: "Update Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], requestBody: { required: true, schema: dtoRef("BankCashAccountUpdateRequestDto") }, responses: { "200": { description: "Successful response.", schema: dtoRef("BankCashAccountResponseDto") } } } },
    delete: {
      method: "DELETE",
      path: "/finance/[companyCode]/bank-cash-accounts/[code]",
      handler: (request: any, context: any) => handleDeleteBankCashAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Company Bank Cash Accounts.",
        tags: ["Company Bank Cash Accounts"],
        responses: {
          "204": { description: "Successful response." },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: { method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/[code]/activate", handler: (request: any, context: any) => handleActivateBankCashAccount(request, context), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Activate", description: "Activate Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], responses: { "200": { description: "Successful response.", schema: dtoRef("BankCashAccountResponseDto") } } } },
    deactivate: { method: "POST", path: "/finance/[companyCode]/bank-cash-accounts/[code]/deactivate", handler: (request: any, context: any) => handleDeactivateBankCashAccount(request, context), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Deactivate", description: "Deactivate Company Bank Cash Accounts.", tags: ["Company Bank Cash Accounts"], responses: { "200": { description: "Successful response.", schema: dtoRef("BankCashAccountResponseDto") } } } },
    batchActivate: {
      method: "POST",
      path: "/finance/[companyCode]/bank-cash-accounts/batch-activate",
      handler: (request: any) => handleBatchActivateBankCashAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Activate",
        description: "Batch Activate Company Bank Cash Accounts.",
        tags: ["Company Bank Cash Accounts"],
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
      path: "/finance/[companyCode]/bank-cash-accounts/batch-deactivate",
      handler: (request: any) => handleBatchDeactivateBankCashAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Deactivate",
        description: "Batch Deactivate Company Bank Cash Accounts.",
        tags: ["Company Bank Cash Accounts"],
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
