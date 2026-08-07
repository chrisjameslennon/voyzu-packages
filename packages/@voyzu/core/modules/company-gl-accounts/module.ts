import { handleActivate as handleActivateGlAccount, handleBatchCreate as handleBatchCreateGlAccounts, handleBatchActivate as handleBatchActivateGlAccounts, handleBatchDeactivate as handleBatchDeactivateGlAccounts, handleBatchDelete as handleBatchDeleteGlAccounts, handleBatchGet as handleBatchGetGlAccounts, handleBatchPatch as handleBatchPatchGlAccounts, handleBatchUpdate as handleBatchUpdateGlAccounts, handleCreate as handleCreateGlAccount, handleDeactivate as handleDeactivateGlAccount, handleDelete as handleDeleteGlAccount, handleFilter as handleFilterGlAccounts, handleGet as handleGetGlAccount, handleList as handleListGlAccounts, handlePatch as handlePatchGlAccount, handleSearch as handleSearchGlAccounts, handleUpdate as handleUpdateGlAccount } from "@voyzu/core/common/gl-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { CompanyGlAccountsListPage, CompanyGlAccountDetailPage } from "./server";

export const companyGlAccountsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.company-gl-accounts.page.list",
          pageTitle: "General Ledger Accounts",
          helpPath: "modules-help/company-ledger/gl-accounts",
          path: "/finance/settings/gl-accounts",
          Page: CompanyGlAccountsListPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Settings" },
                { label: "General Ledger" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.company-gl-accounts.page.detail",
          pageTitle: "General Ledger Account",
          helpPath: "modules-help/company-ledger/gl-accounts",
          path: "/finance/settings/gl-accounts/[code]",
          Page: CompanyGlAccountDetailPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Settings" },
                { label: "General Ledger" },
                { label: "General Ledger Accounts", href: "/finance/settings/gl-accounts" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/gl-accounts",
      handler: (request: any) => handleListGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company GL Accounts.",
        tags: ["Company GL Accounts"],
        responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("GlAccountResponseDto")) } },
      },
    },
    filter: {
      method: "POST",
      path: "/finance/[companyCode]/gl-accounts/filter",
      handler: (request: any) => handleFilterGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Filter",
        description: "Filter Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: dtoRef("FilterRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    search: {
      method: "GET",
      path: "/finance/[companyCode]/gl-accounts/search",
      handler: (request: any) => handleSearchGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Search",
        description: "Search Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match company GL account records.",
            schema: { type: "string" },
          },
        },        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    create: {
      method: "POST",
      path: "/finance/[companyCode]/gl-accounts",
      handler: (request: any) => handleCreateGlAccount(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: dtoRef("GlAccountCreateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchCreate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-accounts/batch",
      handler: (request: any) => handleBatchCreateGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Create",
        description: "Batch Create Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: arrayOf(dtoRef("GlAccountCreateRequestDto")) },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/finance/[companyCode]/gl-accounts/batch/get",
      handler: (request: any) => handleBatchGetGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Get",
        description: "Batch Get Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/finance/[companyCode]/gl-accounts/batch",
      handler: (request: any) => handleBatchUpdateGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Update",
        description: "Batch Update Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: arrayOf(dtoRef("GlAccountBatchUpdateRequestDto")) },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchPatch: {
      method: "PATCH",
      path: "/finance/[companyCode]/gl-accounts/batch",
      handler: (request: any) => handleBatchPatchGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Patch",
        description: "Batch Patch Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: arrayOf(dtoRef("GlAccountBatchPatchRequestDto")) },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDelete: {
      method: "DELETE",
      path: "/finance/[companyCode]/gl-accounts/batch",
      handler: (request: any) => handleBatchDeleteGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Delete",
        description: "Batch Delete Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "204": { description: "Successful response." },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-accounts/batch-activate",
      handler: (request: any) => handleBatchActivateGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Activate",
        description: "Batch Activate Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-accounts/batch-deactivate",
      handler: (request: any) => handleBatchDeactivateGlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Deactivate",
        description: "Batch Deactivate Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-accounts/[code]/activate",
      handler: (request: any, context: any) => handleActivateGlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Activate",
        description: "Activate Company GL Accounts.",
        tags: ["Company GL Accounts"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("GlAccountResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    deactivate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-accounts/[code]/deactivate",
      handler: (request: any, context: any) => handleDeactivateGlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Deactivate",
        description: "Deactivate Company GL Accounts.",
        tags: ["Company GL Accounts"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("GlAccountResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/gl-accounts/[code]",
      handler: (request: any, context: any) => handleGetGlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company GL Accounts.",
        tags: ["Company GL Accounts"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("GlAccountResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") } },
      },
    },
    update: {
      method: "PUT",
      path: "/finance/[companyCode]/gl-accounts/[code]",
      handler: (request: any, context: any) => handleUpdateGlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: dtoRef("GlAccountUpdateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/finance/[companyCode]/gl-accounts/[code]",
      handler: (request: any, context: any) => handlePatchGlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company GL Accounts.",
        tags: ["Company GL Accounts"],
        requestBody: { required: true, schema: dtoRef("GlAccountPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/finance/[companyCode]/gl-accounts/[code]",
      handler: (request: any, context: any) => handleDeleteGlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Company GL Accounts.",
        tags: ["Company GL Accounts"],
        responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") } },
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
