import Type from "typebox";
import { handleActivate as handleActivateItemPostingProfile, handleBatchActivate as handleBatchActivateItemPostingProfiles, handleBatchCreate as handleBatchCreateItemPostingProfiles, handleBatchDeactivate as handleBatchDeactivateItemPostingProfiles, handleBatchDelete as handleBatchDeleteItemPostingProfiles, handleBatchGet as handleBatchGetItemPostingProfiles, handleBatchPatch as handleBatchPatchItemPostingProfiles, handleBatchUpdate as handleBatchUpdateItemPostingProfiles, handleCreate as handleCreateItemPostingProfile, handleDeactivate as handleDeactivateItemPostingProfile, handleDelete as handleDeleteItemPostingProfile, handleFilter as handleFilterItemPostingProfiles, handleGet as handleGetItemPostingProfile, handleList as handleListItemPostingProfiles, handlePatch as handlePatchItemPostingProfile, handleSearch as handleSearchItemPostingProfiles, handleUpdate as handleUpdateItemPostingProfile } from "@voyzu/core/common/inventory-item-posting-profiles/server";
import { CompanyInventoryItemPostingProfilesListPage, CompanyInventoryItemPostingProfileDetailPage } from "@voyzu/core/company-inventory-item-posting-profiles/server";
import { BusinessRuleErrorResponseDto, CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ItemPostingProfileResponseDto } from "../../types/modules/inventory-item-posting-profiles/item-posting-profile.response.dto";
import { ItemPostingProfilePatchRequestDto } from "../../types/modules/inventory-item-posting-profiles/item-posting-profile.patch.request.dto";
import { ItemPostingProfileUpdateRequestDto } from "../../types/modules/inventory-item-posting-profiles/item-posting-profile.update.request.dto";
import { ItemPostingProfileCreateRequestDto } from "../../types/modules/inventory-item-posting-profiles/item-posting-profile.create.request.dto";
import { ItemPostingProfileBatchPatchRequestDto } from "../../types/modules/inventory-item-posting-profiles/item-posting-profile.batch-patch.request.dto";
import { ItemPostingProfileBatchUpdateRequestDto } from "../../types/modules/inventory-item-posting-profiles/item-posting-profile.batch-update.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/inventory/item-posting-profiles",
    handler: (request: any) => handleListItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ItemPostingProfileResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  filter: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/filter",
    handler: (request: any) => handleFilterItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  search: {
    method: "GET",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/search",
    handler: (request: any) => handleSearchItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match item posting profile records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchGet: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/batch/get",
    handler: (request: any) => handleBatchGetItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/batch/create",
    handler: (request: any) => handleBatchCreateItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(ItemPostingProfileCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchUpdate: {
    method: "PUT",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/batch",
    handler: (request: any) => handleBatchUpdateItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(ItemPostingProfileBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchPatch: {
    method: "PATCH",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/batch",
    handler: (request: any) => handleBatchPatchItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(ItemPostingProfileBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchDelete: {
    method: "DELETE",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/batch",
    handler: (request: any) => handleBatchDeleteItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "204": { description: "Successful response." } }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/item-posting-profiles",
    handler: (request: any) => handleCreateItemPostingProfile(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: ItemPostingProfileCreateRequestDto },
    summary: "Create",
    description: "Create Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ItemPostingProfileResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]",
    handler: (request: any, context: any) => handleGetItemPostingProfile(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]",
    handler: (request: any, context: any) => handleUpdateItemPostingProfile(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ItemPostingProfileUpdateRequestDto },
    summary: "Update",
    description: "Update Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ItemPostingProfileResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]",
    handler: (request: any, context: any) => handlePatchItemPostingProfile(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ItemPostingProfilePatchRequestDto },
    summary: "Patch",
    description: "Patch Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ItemPostingProfileResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  delete: {
    method: "DELETE",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]",
    handler: (request: any, context: any) => handleDeleteItemPostingProfile(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]/activate",
    handler: (request: any, context: any) => handleActivateItemPostingProfile(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  deactivate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/[code]/deactivate",
    handler: (request: any, context: any) => handleDeactivateItemPostingProfile(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/batch-activate",
    handler: (request: any) => handleBatchActivateItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ItemPostingProfileResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDeactivate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/item-posting-profiles/batch-deactivate",
    handler: (request: any) => handleBatchDeactivateItemPostingProfiles(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Company Inventory Item Posting Profiles.",
    tags: ["Company Inventory Item Posting Profiles"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ItemPostingProfileResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
