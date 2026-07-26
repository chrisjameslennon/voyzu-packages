import {
  handleActivate as handleCountriesActivate,
  handleBatchActivate as handleCountriesBatchActivate,
  handleBatchCreate as handleCountriesBatchCreate,
  handleBatchDeactivate as handleCountriesBatchDeactivate,
  handleBatchDelete as handleCountriesBatchDelete,
  handleBatchGet as handleCountriesBatchGet,
  handleBatchPatch as handleCountriesBatchPatch,
  handleBatchUpdate as handleCountriesBatchUpdate,
  handleCreate as handleCountriesCreate,
  handleDeactivate as handleCountriesDeactivate,
  handleDelete as handleCountriesDelete,
  handleFilter as handleCountriesFilter,
  handleGet as handleCountriesGet,
  handleList as handleCountriesList,
  handlePatch as handleCountriesPatch,
  handleSearch as handleCountriesSearch,
  handleUpdate as handleCountriesUpdate,
} from "@voyzu-modules/all-modules/countries/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

const commonResponses = {
  "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
} as const;

export const countriesModule = {
  id: "voyzu.countries",
  name: "Countries",
  pageRoutes: {
    list: {
      id: "voyzu.countries.page.list",
      pageTitle: "Countries",
      helpUrl: "modules-help/organization-financial-settings/country",
    },
    detail: {
      id: "voyzu.countries.page.detail",
      pageTitle: "Country",
      helpUrl: "modules-help/organization-financial-settings/country",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/countries",
      handler: (request: any) => handleCountriesList(request),
      apiDoc: {
        summary: "List",
        description: "Lists countries.",
        tags: ["Countries"],
        responses: {
          "200": { description: "A list of all countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          ...commonResponses,
        },
      },
    },
    create: {
      method: "POST",
      path: "/organization/countries",
      handler: (request: any) => handleCountriesCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Creates a country. Status defaults to ACTIVE and cannot be supplied in the request body.",
        tags: ["Countries"],
        requestBody: { required: true, schema: dtoRef("CountryCreateRequestDto") },
        responses: {
          "201": { description: "The created country.", schema: dtoRef("CountryResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "A country with this code already exists.", schema: dtoRef("ConflictErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    filter: {
      method: "POST",
      path: "/organization/countries/filter",
      handler: (request: any) => handleCountriesFilter(request),
      apiDoc: {
        summary: "Filter",
        description: "Filters countries using the shared filter request body.",
        tags: ["Countries"],
        requestBody: { required: true, schema: dtoRef("FilterRequestDto") },
        responses: {
          "200": { description: "A filtered list of countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          ...commonResponses,
        },
      },
    },
    search: {
      method: "GET",
      path: "/organization/countries/search",
      handler: (request: any) => handleCountriesSearch(request),
      apiDoc: {
        summary: "Search",
        description: "Searches countries.",
        tags: ["Countries"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match country records.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": { description: "A list of matching countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchCreate: {
      method: "POST",
      path: "/organization/countries/batch/create",
      handler: (request: any) => handleCountriesBatchCreate(request),
      apiDoc: {
        summary: "Batch Create",
        description: "Creates multiple countries. Status defaults to ACTIVE and cannot be supplied in the request body.",
        tags: ["Countries"],
        requestBody: { required: true, schema: arrayOf(dtoRef("CountryCreateRequestDto")) },
        responses: {
          "201": { description: "The created countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "One or more country codes already exist.", schema: dtoRef("ConflictErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/organization/countries/batch/get",
      handler: (request: any) => handleCountriesBatchGet(request),
      apiDoc: {
        summary: "Batch Get",
        description: "Gets multiple countries by code.",
        tags: ["Countries"],
        requestBody: { required: true, schema: dtoRef("CountryCodesRequestDto") },
        responses: {
          "200": { description: "The requested countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/organization/countries/batch/update",
      handler: (request: any) => handleCountriesBatchUpdate(request),
      apiDoc: {
        summary: "Batch Update",
        description: "Updates multiple countries. Status cannot be changed by this request; code identifies each row.",
        tags: ["Countries"],
        requestBody: { required: true, schema: arrayOf(dtoRef("CountryBatchUpdateRequestDto")) },
        responses: {
          "200": { description: "The updated countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more countries were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchPatch: {
      method: "PATCH",
      path: "/organization/countries/batch/patch",
      handler: (request: any) => handleCountriesBatchPatch(request),
      apiDoc: {
        summary: "Batch Patch",
        description: "Patches multiple countries. Status cannot be changed by this request; code identifies each row.",
        tags: ["Countries"],
        requestBody: { required: true, schema: arrayOf(dtoRef("CountryBatchPatchRequestDto")) },
        responses: {
          "200": { description: "The patched countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more countries were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchDelete: {
      method: "POST",
      path: "/organization/countries/batch/delete",
      handler: (request: any) => handleCountriesBatchDelete(request),
      apiDoc: {
        summary: "Batch Delete",
        description: "Deletes multiple countries. Countries with postings cannot be deleted.",
        tags: ["Countries"],
        requestBody: { required: true, schema: dtoRef("CountryCodesRequestDto") },
        responses: {
          "204": { description: "The countries were deleted." },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more countries were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "One or more countries have postings and cannot be deleted.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/organization/countries/batch/activate",
      handler: (request: any) => handleCountriesBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Sets multiple countries to ACTIVE.",
        tags: ["Countries"],
        requestBody: { required: true, schema: dtoRef("CountryCodesRequestDto") },
        responses: {
          "200": { description: "The activated countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more countries were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/organization/countries/batch/deactivate",
      handler: (request: any) => handleCountriesBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Sets multiple countries to INACTIVE.",
        tags: ["Countries"],
        requestBody: { required: true, schema: dtoRef("CountryCodesRequestDto") },
        responses: {
          "200": { description: "The deactivated countries.", schema: arrayOf(dtoRef("CountryResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more countries were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    get: {
      method: "GET",
      path: "/organization/countries/[code]",
      handler: (request: any, context: any) => handleCountriesGet(request, context),
      apiDoc: {
        summary: "Get",
        description: "Gets a country.",
        tags: ["Countries"],
        requestPathParams: { code: { description: "Country code.", schema: { type: "string" } } },
        responses: {
          "200": { description: "The requested country.", schema: dtoRef("CountryResponseDto") },
          "404": { description: "Country was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    update: {
      method: "PUT",
      path: "/organization/countries/[code]",
      handler: (request: any, context: any) => handleCountriesUpdate(request, context),
      apiDoc: {
        summary: "Update",
        description: "Updates a country. Status and code cannot be changed by this request.",
        tags: ["Countries"],
        requestPathParams: { code: { description: "Country code.", schema: { type: "string" } } },
        requestBody: { required: true, schema: dtoRef("CountryUpdateRequestDto") },
        responses: {
          "200": { description: "The updated country.", schema: dtoRef("CountryResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Country was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/countries/[code]",
      handler: (request: any, context: any) => handleCountriesPatch(request, context),
      apiDoc: {
        summary: "Patch",
        description: "Patches a country. Status and code cannot be changed by this request.",
        tags: ["Countries"],
        requestPathParams: { code: { description: "Country code.", schema: { type: "string" } } },
        requestBody: { required: true, schema: dtoRef("CountryPatchRequestDto") },
        responses: {
          "200": { description: "The patched country.", schema: dtoRef("CountryResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Country was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/organization/countries/[code]",
      handler: (request: any, context: any) => handleCountriesDelete(request, context),
      apiDoc: {
        summary: "Delete",
        description: "Deletes a country. Countries with postings cannot be deleted.",
        tags: ["Countries"],
        requestPathParams: { code: { description: "Country code.", schema: { type: "string" } } },
        responses: {
          "204": { description: "The country was deleted." },
          "404": { description: "Country was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "Country has postings and cannot be deleted.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    activate: {
      method: "POST",
      path: "/organization/countries/[code]/activate",
      handler: (request: any, context: any) => handleCountriesActivate(request, context),
      apiDoc: {
        summary: "Activate",
        description: "Sets a country to ACTIVE.",
        tags: ["Countries"],
        requestPathParams: { code: { description: "Country code.", schema: { type: "string" } } },
        responses: {
          "200": { description: "The activated country.", schema: dtoRef("CountryResponseDto") },
          "404": { description: "Country was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    deactivate: {
      method: "POST",
      path: "/organization/countries/[code]/deactivate",
      handler: (request: any, context: any) => handleCountriesDeactivate(request, context),
      apiDoc: {
        summary: "Deactivate",
        description: "Sets a country to INACTIVE.",
        tags: ["Countries"],
        requestPathParams: { code: { description: "Country code.", schema: { type: "string" } } },
        responses: {
          "200": { description: "The deactivated country.", schema: dtoRef("CountryResponseDto") },
          "404": { description: "Country was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
  }
} as const;
