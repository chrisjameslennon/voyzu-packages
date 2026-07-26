import { handleActivate as handleCurrenciesActivate, handleBatchActivate as handleCurrenciesBatchActivate, handleBatchCreate as handleCurrenciesBatchCreate, handleBatchDeactivate as handleCurrenciesBatchDeactivate, handleBatchDelete as handleCurrenciesBatchDelete, handleBatchGet as handleCurrenciesBatchGet, handleBatchPatch as handleCurrenciesBatchPatch, handleBatchUpdate as handleCurrenciesBatchUpdate, handleCreate as handleCurrenciesCreate, handleDeactivate as handleCurrenciesDeactivate, handleDelete as handleCurrenciesDelete, handleFilter as handleCurrenciesFilter, handleGet as handleCurrenciesGet, handleList as handleCurrenciesList, handlePatch as handleCurrenciesPatch, handleSearch as handleCurrenciesSearch, handleUpdate as handleCurrenciesUpdate } from "@voyzu-modules/core/currencies/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const currenciesModule = {
  id: "voyzu.currencies",
  name: "Currencies",
  pageRoutes: {
    list: {
      id: "voyzu.currencies.page.list",
      pageTitle: "Currencies",
      helpUrl: "modules-help/organization-financial-settings/currency",
    },
    detail: {
      id: "voyzu.currencies.page.detail",
      pageTitle: "Currency",
      helpUrl: "modules-help/organization-financial-settings/currency",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/currencies",
      handler: (request: any) => handleCurrenciesList(request),
      apiDoc: {
        summary: "List",
        description: "List Currencies.",
        tags: ["Currencies"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("CurrencyResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    create: {
      method: "POST",
      path: "/organization/currencies",
      handler: (request: any) => handleCurrenciesCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Currencies. Status defaults to ACTIVE and cannot be supplied in the request body.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: dtoRef("CurrencyCreateRequestDto") },
        responses: {
          "201": {
            description: "The created currency.",
            schema: dtoRef("CurrencyResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    filter: {
      method: "POST",
      path: "/organization/currencies/filter",
      handler: (request: any) => handleCurrenciesFilter(request),
      apiDoc: {
        summary: "Filter",
        description: "Filter Currencies.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: dtoRef("FilterRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("CurrencyResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    search: {
      method: "GET",
      path: "/organization/currencies/search",
      handler: (request: any) => handleCurrenciesSearch(request),
      apiDoc: {
        summary: "Search",
        description: "Search Currencies.",
        tags: ["Currencies"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match currency records.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("CurrencyResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/organization/currencies/[code]",
      handler: (request: any, context: any) => handleCurrenciesGet(request, context),
      apiDoc: {
        summary: "Get",
        description: "Get Currencies.",
        tags: ["Currencies"],
        requestPathParams: {
          code: {
            description: "Currency business code.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("CurrencyResponseDto")
          },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    update: {
      method: "PUT",
      path: "/organization/currencies/[code]",
      handler: (request: any, context: any) => handleCurrenciesUpdate(request, context),
      apiDoc: {
        summary: "Update",
        description: "Update Currencies.",
        tags: ["Currencies"],
        requestPathParams: {
          code: {
            description: "Currency business code.",
            schema: { type: "string" },
          },
        },
        requestBody: { required: true, schema: dtoRef("CurrencyUpdateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("CurrencyResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/currencies/[code]",
      handler: (request: any, context: any) => handleCurrenciesPatch(request, context),
      apiDoc: {
        summary: "Patch",
        description: "Patch Currencies.",
        tags: ["Currencies"],
        requestPathParams: {
          code: {
            description: "Currency business code.",
            schema: { type: "string" },
          },
        },
        requestBody: { required: true, schema: dtoRef("CurrencyPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("CurrencyResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/organization/currencies/[code]",
      handler: (request: any, context: any) => handleCurrenciesDelete(request, context),
      apiDoc: {
        summary: "Delete",
        description: "Delete Currencies.",
        tags: ["Currencies"],
        requestPathParams: {
          code: {
            description: "Currency business code.",
            schema: { type: "string" },
          },
        },
        responses: {
          "204": { description: "Successful response." },
          "422": { description: "Currency has postings and cannot be deleted.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchCreate: {
      method: "POST",
      path: "/organization/currencies/batch/create",
      handler: (request: any) => handleCurrenciesBatchCreate(request),
      apiDoc: {
        summary: "Batch Create",
        description: "Creates multiple currencies. Status defaults to ACTIVE and cannot be supplied in the request body.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: arrayOf(dtoRef("CurrencyCreateRequestDto")) },
        responses: {
          "201": { description: "The created currencies.", schema: arrayOf(dtoRef("CurrencyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "One or more currency codes already exist.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/organization/currencies/batch/get",
      handler: (request: any) => handleCurrenciesBatchGet(request),
      apiDoc: {
        summary: "Batch Get",
        description: "Gets multiple currencies by code.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: dtoRef("CurrencyCodesRequestDto") },
        responses: {
          "200": { description: "The requested currencies.", schema: arrayOf(dtoRef("CurrencyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/organization/currencies/batch/update",
      handler: (request: any) => handleCurrenciesBatchUpdate(request),
      apiDoc: {
        summary: "Batch Update",
        description: "Updates multiple currencies. Status and code cannot be changed by this request; code identifies each row.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: arrayOf(dtoRef("CurrencyBatchUpdateRequestDto")) },
        responses: {
          "200": { description: "The updated currencies.", schema: arrayOf(dtoRef("CurrencyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more currencies were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchPatch: {
      method: "PATCH",
      path: "/organization/currencies/batch/patch",
      handler: (request: any) => handleCurrenciesBatchPatch(request),
      apiDoc: {
        summary: "Batch Patch",
        description: "Patches multiple currencies. Status and code cannot be changed by this request; code identifies each row.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: arrayOf(dtoRef("CurrencyBatchPatchRequestDto")) },
        responses: {
          "200": { description: "The patched currencies.", schema: arrayOf(dtoRef("CurrencyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more currencies were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDelete: {
      method: "POST",
      path: "/organization/currencies/batch/delete",
      handler: (request: any) => handleCurrenciesBatchDelete(request),
      apiDoc: {
        summary: "Batch Delete",
        description: "Deletes multiple currencies. Currencies with postings cannot be deleted.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: dtoRef("CurrencyCodesRequestDto") },
        responses: {
          "204": { description: "The currencies were deleted." },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more currencies were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "One or more currencies have postings and cannot be deleted.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: {
      method: "POST",
      path: "/organization/currencies/[code]/activate",
      handler: (request: any, context: any) => handleCurrenciesActivate(request, context),
      apiDoc: {
        summary: "Activate",
        description: "Sets a currency to ACTIVE.",
        tags: ["Currencies"],
        requestPathParams: {
          code: {
            description: "Currency business code.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("CurrencyResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    deactivate: {
      method: "POST",
      path: "/organization/currencies/[code]/deactivate",
      handler: (request: any, context: any) => handleCurrenciesDeactivate(request, context),
      apiDoc: {
        summary: "Deactivate",
        description: "Sets a currency to INACTIVE.",
        tags: ["Currencies"],
        requestPathParams: {
          code: {
            description: "Currency business code.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("CurrencyResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/organization/currencies/batch/activate",
      handler: (request: any) => handleCurrenciesBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Sets multiple currencies to ACTIVE.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: dtoRef("CurrencyCodesRequestDto") },
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("CurrencyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/organization/currencies/batch/deactivate",
      handler: (request: any) => handleCurrenciesBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Sets multiple currencies to INACTIVE.",
        tags: ["Currencies"],
        requestBody: { required: true, schema: dtoRef("CurrencyCodesRequestDto") },
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("CurrencyResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
