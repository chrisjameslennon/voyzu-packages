import { handleActivate as handleGlAccountCategoriesActivate, handleBatchActivate as handleGlAccountCategoriesBatchActivate, handleBatchCreate as handleGlAccountCategoriesBatchCreate, handleBatchDeactivate as handleGlAccountCategoriesBatchDeactivate, handleBatchDelete as handleGlAccountCategoriesBatchDelete, handleBatchGet as handleGlAccountCategoriesBatchGet, handleBatchPatch as handleGlAccountCategoriesBatchPatch, handleBatchUpdate as handleGlAccountCategoriesBatchUpdate, handleCreate as handleGlAccountCategoriesCreate, handleDeactivate as handleGlAccountCategoriesDeactivate, handleDelete as handleGlAccountCategoriesDelete, handleFilter as handleGlAccountCategoriesFilter, handleGet as handleGlAccountCategoriesGet, handleList as handleGlAccountCategoriesList, handlePatch as handleGlAccountCategoriesPatch, handleSearch as handleGlAccountCategoriesSearch, handleUpdate as handleGlAccountCategoriesUpdate } from "@voyzu-modules/core/common/gl-account-categories/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationGlAccountCategoriesModule = {
  pageRoutes: {
    list: {
      id: "voyzu.organization-gl-account-categories.page.list",
      pageTitle: "Reporting Categories",
      helpUrl: "modules-help/organization-financial-settings/reporting-categories",
    },
    detail: {
      id: "voyzu.organization-gl-account-categories.page.detail",
      pageTitle: "Reporting Category",
      helpUrl: "modules-help/organization-financial-settings/reporting-categories",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/gl-account-categories",
      handler: (request: any) => handleGlAccountCategoriesList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
      },
    },
    create: {
      method: "POST",
      path: "/organization/gl-account-categories",
      handler: (request: any) => handleGlAccountCategoriesCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
    filter: {
      method: "POST",
      path: "/organization/gl-account-categories/filter",
      handler: (request: any) => handleGlAccountCategoriesFilter(request),
      apiDoc: {
        summary: "Filter",
        description: "Filter Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/search",
      handler: (request: any) => handleGlAccountCategoriesSearch(request),
      apiDoc: {
        summary: "Search",
        description: "Search Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match organization GL account category records.",
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
    batchCreate: {
      method: "POST",
      path: "/organization/gl-account-categories/batch/create",
      handler: (request: any) => handleGlAccountCategoriesBatchCreate(request),
      apiDoc: {
        summary: "Batch Create",
        description: "Batch Create Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/batch/get",
      handler: (request: any) => handleGlAccountCategoriesBatchGet(request),
      apiDoc: {
        summary: "Batch Get",
        description: "Batch Get Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/batch/update",
      handler: (request: any) => handleGlAccountCategoriesBatchUpdate(request),
      apiDoc: {
        summary: "Batch Update",
        description: "Batch Update Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/batch/patch",
      handler: (request: any) => handleGlAccountCategoriesBatchPatch(request),
      apiDoc: {
        summary: "Batch Patch",
        description: "Batch Patch Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      method: "POST",
      path: "/organization/gl-account-categories/batch/delete",
      handler: (request: any) => handleGlAccountCategoriesBatchDelete(request),
      apiDoc: {
        summary: "Batch Delete",
        description: "Batch Delete Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/batch-activate",
      handler: (request: any) => handleGlAccountCategoriesBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Batch Activate Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/batch-deactivate",
      handler: (request: any) => handleGlAccountCategoriesBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Batch Deactivate Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/[code]/activate",
      handler: (request: any, context: any) => handleGlAccountCategoriesActivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Activate",
        description: "Activate Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/[code]/deactivate",
      handler: (request: any, context: any) => handleGlAccountCategoriesDeactivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Deactivate",
        description: "Deactivate Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/[code]",
      handler: (request: any, context: any) => handleGlAccountCategoriesGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
      },
    },
    update: {
      method: "PUT",
      path: "/organization/gl-account-categories/[code]",
      handler: (request: any, context: any) => handleGlAccountCategoriesUpdate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/[code]",
      handler: (request: any, context: any) => handleGlAccountCategoriesPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
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
      path: "/organization/gl-account-categories/[code]",
      handler: (request: any, context: any) => handleGlAccountCategoriesDelete(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Organization GL Account Categories.",
        tags: ["Organization GL Account Categories"],
      },
    },
  }
} as const;
