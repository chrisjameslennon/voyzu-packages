import { handleActivate as handleActivateItemPostingProfile, handleBatchActivate as handleBatchActivateItemPostingProfiles, handleBatchCreate as handleBatchCreateItemPostingProfiles, handleBatchDeactivate as handleBatchDeactivateItemPostingProfiles, handleBatchDelete as handleBatchDeleteItemPostingProfiles, handleBatchGet as handleBatchGetItemPostingProfiles, handleBatchPatch as handleBatchPatchItemPostingProfiles, handleBatchUpdate as handleBatchUpdateItemPostingProfiles, handleCreate as handleCreateItemPostingProfile, handleDeactivate as handleDeactivateItemPostingProfile, handleDelete as handleDeleteItemPostingProfile, handleFilter as handleFilterItemPostingProfiles, handleGet as handleGetItemPostingProfile, handleList as handleListItemPostingProfiles, handlePatch as handlePatchItemPostingProfile, handleSearch as handleSearchItemPostingProfiles, handleUpdate as handleUpdateItemPostingProfile } from "@voyzu-modules/all-modules/common/inventory-item-posting-profiles/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyInventoryItemPostingProfilesModule = {
  id: "voyzu.company-inventory-item-posting-profiles",
  name: "Item Posting Profiles",
  pageRoutes: {
    list: {
      id: "voyzu.company-inventory-item-posting-profiles.page.list",
      pageTitle: "Item Posting Profiles",
      helpUrl: "modules-help/company-ledger/inventory-item-posting-profiles",
    },
    detail: {
      id: "voyzu.company-inventory-item-posting-profiles.page.detail",
      pageTitle: "Item Posting Profile",
      helpUrl: "modules-help/company-ledger/inventory-item-posting-profiles",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/inventory/item-posting-profiles",
      handler: (request: any) => handleListItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Inventory Item Posting Profiles.",
        tags: ["Company Inventory Item Posting Profiles"],
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
      path: "/finance/[companyCode]/inventory/item-posting-profiles/filter",
      handler: (request: any) => handleFilterItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Filter", description: "Filter Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    search: {
      method: "GET",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/search",
      handler: (request: any) => handleSearchItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Search", description: "Search Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], requestQuerystringParams: { q: { description: "Search text used to match item posting profile records.", schema: { type: "string" } } }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchGet: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/batch/get",
      handler: (request: any) => handleBatchGetItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Get", description: "Batch Get Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchCreate: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/batch/create",
      handler: (request: any) => handleBatchCreateItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Create", description: "Batch Create Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], requestBody: { required: true, schema: arrayOf(dtoRef("ItemPostingProfileCreateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchUpdate: {
      method: "PUT",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/batch",
      handler: (request: any) => handleBatchUpdateItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Update", description: "Batch Update Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], requestBody: { required: true, schema: arrayOf(dtoRef("ItemPostingProfileBatchUpdateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchPatch: {
      method: "PATCH",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/batch",
      handler: (request: any) => handleBatchPatchItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Patch", description: "Batch Patch Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], requestBody: { required: true, schema: arrayOf(dtoRef("ItemPostingProfileBatchPatchRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("ItemPostingProfileResponseDto")) } } },
    },
    batchDelete: {
      method: "DELETE",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/batch",
      handler: (request: any) => handleBatchDeleteItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Delete", description: "Batch Delete Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Successful response." } } },
    },
    create: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/item-posting-profiles",
      handler: (request: any) => handleCreateItemPostingProfile(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Company Inventory Item Posting Profiles.",
        tags: ["Company Inventory Item Posting Profiles"],
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
      path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]",
      handler: (request: any, context: any) => handleGetItemPostingProfile(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Get", description: "Get Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], responses: { "200": { description: "Successful response.", schema: dtoRef("ItemPostingProfileResponseDto") } } },
    },
    update: {
      method: "PUT",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]",
      handler: (request: any, context: any) => handleUpdateItemPostingProfile(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Company Inventory Item Posting Profiles.",
        tags: ["Company Inventory Item Posting Profiles"],
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
      path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]",
      handler: (request: any, context: any) => handlePatchItemPostingProfile(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company Inventory Item Posting Profiles.",
        tags: ["Company Inventory Item Posting Profiles"],
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
      path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]",
      handler: (request: any, context: any) => handleDeleteItemPostingProfile(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Company Inventory Item Posting Profiles.",
        tags: ["Company Inventory Item Posting Profiles"],
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
      path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]/activate",
      handler: (request: any, context: any) => handleActivateItemPostingProfile(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Activate", description: "Activate Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], responses: { "200": { description: "Successful response.", schema: dtoRef("ItemPostingProfileResponseDto") } } },
    },
    deactivate: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]/deactivate",
      handler: (request: any, context: any) => handleDeactivateItemPostingProfile(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Deactivate", description: "Deactivate Company Inventory Item Posting Profiles.", tags: ["Company Inventory Item Posting Profiles"], responses: { "200": { description: "Successful response.", schema: dtoRef("ItemPostingProfileResponseDto") } } },
    },
    batchActivate: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/item-posting-profiles/batch-activate",
      handler: (request: any) => handleBatchActivateItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Activate",
        description: "Batch Activate Company Inventory Item Posting Profiles.",
        tags: ["Company Inventory Item Posting Profiles"],
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
      path: "/finance/[companyCode]/inventory/item-posting-profiles/batch-deactivate",
      handler: (request: any) => handleBatchDeactivateItemPostingProfiles(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Deactivate",
        description: "Batch Deactivate Company Inventory Item Posting Profiles.",
        tags: ["Company Inventory Item Posting Profiles"],
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
