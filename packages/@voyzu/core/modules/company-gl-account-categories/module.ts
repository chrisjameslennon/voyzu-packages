import { handleActivate as handleActivateGlAccountCategory, handleBatchActivate as handleBatchActivateGlAccountCategories, handleBatchCreate as handleBatchCreateGlAccountCategories, handleBatchDeactivate as handleBatchDeactivateGlAccountCategories, handleBatchDelete as handleBatchDeleteGlAccountCategories, handleBatchGet as handleBatchGetGlAccountCategories, handleBatchPatch as handleBatchPatchGlAccountCategories, handleBatchUpdate as handleBatchUpdateGlAccountCategories, handleCreate as handleCreateGlAccountCategory, handleDeactivate as handleDeactivateGlAccountCategory, handleDelete as handleDeleteGlAccountCategory, handleFilter as handleFilterGlAccountCategories, handleGet as handleGetGlAccountCategory, handleList as handleListGlAccountCategories, handlePatch as handlePatchGlAccountCategory, handleSearch as handleSearchGlAccountCategories, handleUpdate as handleUpdateGlAccountCategory } from "@voyzu/core/common/gl-account-categories/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { CompanyGlAccountCategoriesListPage, CompanyGlAccountCategoryDetailPage } from "@voyzu/core/company-gl-account-categories/server";

export const companyGlAccountCategoriesModule = {
  pageRoutes: {
    list: {
          id: "voyzu.company-gl-account-categories.page.list",
          pageTitle: "Reporting Categories",
          helpPath: "modules-help/company-ledger/reporting-categories",
          path: "/finance/settings/reporting-categories",
          Page: CompanyGlAccountCategoriesListPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Settings" },
                { label: "General Ledger" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.company-gl-account-categories.page.detail",
          pageTitle: "Reporting Category",
          helpPath: "modules-help/company-ledger/reporting-categories",
          path: "/finance/settings/reporting-categories/[code]",
          Page: CompanyGlAccountCategoryDetailPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Settings" },
                { label: "General Ledger" },
                { label: "Reporting Categories", href: "/finance/settings/reporting-categories" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/gl-account-categories",
      handler: (request: any) => handleListGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("GlAccountCategoryResponseDto")) } },
      },
    },
    filter: {
      method: "POST",
      path: "/finance/[companyCode]/gl-account-categories/filter",
      handler: (request: any) => handleFilterGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Filter",
        description: "Filter Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: dtoRef("FilterRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountCategoryResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    search: {
      method: "GET",
      path: "/finance/[companyCode]/gl-account-categories/search",
      handler: (request: any) => handleSearchGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Search",
        description: "Search Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match company GL account category records.",
            schema: { type: "string" },
          },
        },        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountCategoryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    create: {
      method: "POST",
      path: "/finance/[companyCode]/gl-account-categories",
      handler: (request: any) => handleCreateGlAccountCategory(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: dtoRef("GlAccountCategoryCreateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountCategoryResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchCreate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-account-categories/batch",
      handler: (request: any) => handleBatchCreateGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Create",
        description: "Batch Create Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: arrayOf(dtoRef("GlAccountCategoryCreateRequestDto")) },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountCategoryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/finance/[companyCode]/gl-account-categories/batch/get",
      handler: (request: any) => handleBatchGetGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Get",
        description: "Batch Get Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountCategoryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/finance/[companyCode]/gl-account-categories/batch",
      handler: (request: any) => handleBatchUpdateGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Update",
        description: "Batch Update Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: arrayOf(dtoRef("GlAccountCategoryBatchUpdateRequestDto")) },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountCategoryResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchPatch: {
      method: "PATCH",
      path: "/finance/[companyCode]/gl-account-categories/batch",
      handler: (request: any) => handleBatchPatchGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Patch",
        description: "Batch Patch Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: arrayOf(dtoRef("GlAccountCategoryBatchPatchRequestDto")) },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountCategoryResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDelete: {
      method: "DELETE",
      path: "/finance/[companyCode]/gl-account-categories/batch",
      handler: (request: any) => handleBatchDeleteGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Delete",
        description: "Batch Delete Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "204": { description: "Successful response." },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-account-categories/batch-activate",
      handler: (request: any) => handleBatchActivateGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Activate",
        description: "Batch Activate Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountCategoryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-account-categories/batch-deactivate",
      handler: (request: any) => handleBatchDeactivateGlAccountCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Deactivate",
        description: "Batch Deactivate Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountCategoryResponseDto"))
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-account-categories/[code]/activate",
      handler: (request: any, context: any) => handleActivateGlAccountCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Activate",
        description: "Activate Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("GlAccountCategoryResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    deactivate: {
      method: "POST",
      path: "/finance/[companyCode]/gl-account-categories/[code]/deactivate",
      handler: (request: any, context: any) => handleDeactivateGlAccountCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Deactivate",
        description: "Deactivate Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("GlAccountCategoryResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/gl-account-categories/[code]",
      handler: (request: any, context: any) => handleGetGlAccountCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("GlAccountCategoryResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") } },
      },
    },
    update: {
      method: "PUT",
      path: "/finance/[companyCode]/gl-account-categories/[code]",
      handler: (request: any, context: any) => handleUpdateGlAccountCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: dtoRef("GlAccountCategoryUpdateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountCategoryResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/finance/[companyCode]/gl-account-categories/[code]",
      handler: (request: any, context: any) => handlePatchGlAccountCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        requestBody: { required: true, schema: dtoRef("GlAccountCategoryPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountCategoryResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/finance/[companyCode]/gl-account-categories/[code]",
      handler: (request: any, context: any) => handleDeleteGlAccountCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Company GL Account Categories.",
        tags: ["Company GL Account Categories"],
        responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") } },
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
