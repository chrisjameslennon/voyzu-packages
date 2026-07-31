import { handleActivate as handleItemPostingProfilesActivate, handleBatchActivate as handleItemPostingProfilesBatchActivate, handleBatchCreate as handleItemPostingProfilesBatchCreate, handleBatchDeactivate as handleItemPostingProfilesBatchDeactivate, handleBatchDelete as handleItemPostingProfilesBatchDelete, handleBatchGet as handleItemPostingProfilesBatchGet, handleBatchPatch as handleItemPostingProfilesBatchPatch, handleBatchUpdate as handleItemPostingProfilesBatchUpdate, handleCreate as handleItemPostingProfilesCreate, handleDeactivate as handleItemPostingProfilesDeactivate, handleDelete as handleItemPostingProfilesDelete, handleFilter as handleItemPostingProfilesFilter, handleGet as handleItemPostingProfilesGet, handleList as handleItemPostingProfilesList, handlePatch as handleItemPostingProfilesPatch, handleSearch as handleItemPostingProfilesSearch, handleUpdate as handleItemPostingProfilesUpdate } from "@voyzu-modules/core/common/inventory-item-posting-profiles/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationInventoryItemPostingProfilesModule = {
  pageRoutes: {
    list: {
      id: "voyzu.organization-inventory-item-posting-profiles.page.list",
      pageTitle: "Item Posting Profiles",
      helpPath: "modules-help/organization-financial-settings/item-posting-profiles",
    },
    detail: {
      id: "voyzu.organization-inventory-item-posting-profiles.page.detail",
      pageTitle: "Item Posting Profile",
      helpPath: "modules-help/organization-financial-settings/item-posting-profiles",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/inventory/item-posting-profiles",
      handler: (request: any) => handleItemPostingProfilesList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Inventory Item Posting Profiles.",
        tags: ["Organization Inventory Item Posting Profiles"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ItemPostingProfileResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    filter: {
      method: "POST",
      path: "/organization/inventory/item-posting-profiles/filter",
      handler: (request: any) => handleItemPostingProfilesFilter(request),
      apiDoc: { summary: "Filter", description: "Filter Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    search: {
      method: "GET",
      path: "/organization/inventory/item-posting-profiles/search",
      handler: (request: any) => handleItemPostingProfilesSearch(request),
      apiDoc: { summary: "Search", description: "Search Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], requestQuerystringParams: { q: { description: "Search text used to match item posting profile records.", schema: { type: "string" } } }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchGet: {
      method: "POST",
      path: "/organization/inventory/item-posting-profiles/batch/get",
      handler: (request: any) => handleItemPostingProfilesBatchGet(request),
      apiDoc: { summary: "Batch Get", description: "Batch Get Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchCreate: {
      method: "POST",
      path: "/organization/inventory/item-posting-profiles/batch/create",
      handler: (request: any) => handleItemPostingProfilesBatchCreate(request),
      apiDoc: { summary: "Batch Create", description: "Batch Create Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], requestBody: { required: true, schema: arrayOf(dtoRef("ItemPostingProfileCreateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchUpdate: {
      method: "PUT",
      path: "/organization/inventory/item-posting-profiles/batch",
      handler: (request: any) => handleItemPostingProfilesBatchUpdate(request),
      apiDoc: { summary: "Batch Update", description: "Batch Update Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], requestBody: { required: true, schema: arrayOf(dtoRef("ItemPostingProfileBatchUpdateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchPatch: {
      method: "PATCH",
      path: "/organization/inventory/item-posting-profiles/batch",
      handler: (request: any) => handleItemPostingProfilesBatchPatch(request),
      apiDoc: { summary: "Batch Patch", description: "Batch Patch Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], requestBody: { required: true, schema: arrayOf(dtoRef("ItemPostingProfileBatchPatchRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchDelete: {
      method: "DELETE",
      path: "/organization/inventory/item-posting-profiles/batch",
      handler: (request: any) => handleItemPostingProfilesBatchDelete(request),
      apiDoc: { summary: "Batch Delete", description: "Batch Delete Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Successful response." } } },
    },
    create: {
      method: "POST",
      path: "/organization/inventory/item-posting-profiles",
      handler: (request: any) => handleItemPostingProfilesCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Organization Inventory Item Posting Profiles.",
        tags: ["Organization Inventory Item Posting Profiles"],
        requestBody: { required: true, schema: dtoRef("ItemPostingProfileCreateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ItemPostingProfileResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/organization/inventory/item-posting-profiles/[code]",
      handler: (request: any, context: any) => handleItemPostingProfilesGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Get", description: "Get Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], responses: { "200": { description: "Successful response.", schema: dtoRef("ItemPostingProfileResponseDto") } } },
    },
    update: {
      method: "PUT",
      path: "/organization/inventory/item-posting-profiles/[code]",
      handler: (request: any, context: any) => handleItemPostingProfilesUpdate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Organization Inventory Item Posting Profiles.",
        tags: ["Organization Inventory Item Posting Profiles"],
        requestBody: { required: true, schema: dtoRef("ItemPostingProfileUpdateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ItemPostingProfileResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/inventory/item-posting-profiles/[code]",
      handler: (request: any, context: any) => handleItemPostingProfilesPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization Inventory Item Posting Profiles.",
        tags: ["Organization Inventory Item Posting Profiles"],
        requestBody: { required: true, schema: dtoRef("ItemPostingProfilePatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ItemPostingProfileResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/organization/inventory/item-posting-profiles/[code]",
      handler: (request: any, context: any) => handleItemPostingProfilesDelete(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Organization Inventory Item Posting Profiles.",
        tags: ["Organization Inventory Item Posting Profiles"],
        responses: {
          "204": { description: "Successful response." },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: {
      method: "POST",
      path: "/organization/inventory/item-posting-profiles/[code]/activate",
      handler: (request: any, context: any) => handleItemPostingProfilesActivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Activate", description: "Activate Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], responses: { "200": { description: "Successful response.", schema: dtoRef("ItemPostingProfileResponseDto") } } },
    },
    deactivate: {
      method: "POST",
      path: "/organization/inventory/item-posting-profiles/[code]/deactivate",
      handler: (request: any, context: any) => handleItemPostingProfilesDeactivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Deactivate", description: "Deactivate Organization Inventory Item Posting Profiles.", tags: ["Organization Inventory Item Posting Profiles"], responses: { "200": { description: "Successful response.", schema: dtoRef("ItemPostingProfileResponseDto") } } },
    },
    batchActivate: {
      method: "POST",
      path: "/organization/inventory/item-posting-profiles/batch-activate",
      handler: (request: any) => handleItemPostingProfilesBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Batch Activate Organization Inventory Item Posting Profiles.",
        tags: ["Organization Inventory Item Posting Profiles"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ItemPostingProfileResponseDto"))
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/organization/inventory/item-posting-profiles/batch-deactivate",
      handler: (request: any) => handleItemPostingProfilesBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Batch Deactivate Organization Inventory Item Posting Profiles.",
        tags: ["Organization Inventory Item Posting Profiles"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ItemPostingProfileResponseDto"))
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
