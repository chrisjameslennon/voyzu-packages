import Type from "typebox";
import { handleActivate as handleItemPostingProfilesActivate, handleBatchActivate as handleItemPostingProfilesBatchActivate, handleBatchCreate as handleItemPostingProfilesBatchCreate, handleBatchDeactivate as handleItemPostingProfilesBatchDeactivate, handleBatchDelete as handleItemPostingProfilesBatchDelete, handleBatchGet as handleItemPostingProfilesBatchGet, handleBatchPatch as handleItemPostingProfilesBatchPatch, handleBatchUpdate as handleItemPostingProfilesBatchUpdate, handleCreate as handleItemPostingProfilesCreate, handleDeactivate as handleItemPostingProfilesDeactivate, handleDelete as handleItemPostingProfilesDelete, handleFilter as handleItemPostingProfilesFilter, handleGet as handleItemPostingProfilesGet, handleList as handleItemPostingProfilesList, handlePatch as handleItemPostingProfilesPatch, handleSearch as handleItemPostingProfilesSearch, handleUpdate as handleItemPostingProfilesUpdate } from "@voyzu/core/common/inventory-item-posting-profiles/server";
import { OrganizationInventoryItemPostingProfilesListPage, OrganizationInventoryItemPostingProfileDetailPage } from "@voyzu/core/organization-inventory-item-posting-profiles/server";
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
    path: "/organization/inventory/item-posting-profiles",
    handler: (request: any) => handleItemPostingProfilesList(request),
    summary: "List",
    description: "List Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
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
    path: "/organization/inventory/item-posting-profiles/filter",
    handler: (request: any) => handleItemPostingProfilesFilter(request),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  search: {
    method: "GET",
    path: "/organization/inventory/item-posting-profiles/search",
    handler: (request: any) => handleItemPostingProfilesSearch(request),
    request: { query: { parameters: { q: { description: "Search text used to match item posting profile records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchGet: {
    method: "POST",
    path: "/organization/inventory/item-posting-profiles/batch/get",
    handler: (request: any) => handleItemPostingProfilesBatchGet(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchCreate: {
    method: "POST",
    path: "/organization/inventory/item-posting-profiles/batch/create",
    handler: (request: any) => handleItemPostingProfilesBatchCreate(request),
    request: { contentType: "application/json", body: Type.Array(ItemPostingProfileCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchUpdate: {
    method: "PUT",
    path: "/organization/inventory/item-posting-profiles/batch",
    handler: (request: any) => handleItemPostingProfilesBatchUpdate(request),
    request: { contentType: "application/json", body: Type.Array(ItemPostingProfileBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchPatch: {
    method: "PATCH",
    path: "/organization/inventory/item-posting-profiles/batch",
    handler: (request: any) => handleItemPostingProfilesBatchPatch(request),
    request: { contentType: "application/json", body: Type.Array(ItemPostingProfileBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchDelete: {
    method: "DELETE",
    path: "/organization/inventory/item-posting-profiles/batch",
    handler: (request: any) => handleItemPostingProfilesBatchDelete(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "204": { description: "Successful response." } }
  },
  create: {
    method: "POST",
    path: "/organization/inventory/item-posting-profiles",
    handler: (request: any) => handleItemPostingProfilesCreate(request),
    request: { contentType: "application/json", body: ItemPostingProfileCreateRequestDto },
    summary: "Create",
    description: "Create Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
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
    path: "/organization/inventory/item-posting-profiles/[code]",
    handler: (request: any, context: any) => handleItemPostingProfilesGet(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/organization/inventory/item-posting-profiles/[code]",
    handler: (request: any, context: any) => handleItemPostingProfilesUpdate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ItemPostingProfileUpdateRequestDto },
    summary: "Update",
    description: "Update Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
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
    path: "/organization/inventory/item-posting-profiles/[code]",
    handler: (request: any, context: any) => handleItemPostingProfilesPatch(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ItemPostingProfilePatchRequestDto },
    summary: "Patch",
    description: "Patch Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
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
    path: "/organization/inventory/item-posting-profiles/[code]",
    handler: (request: any, context: any) => handleItemPostingProfilesDelete(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST",
    path: "/organization/inventory/item-posting-profiles/[code]/activate",
    handler: (request: any, context: any) => handleItemPostingProfilesActivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  deactivate: {
    method: "POST",
    path: "/organization/inventory/item-posting-profiles/[code]/deactivate",
    handler: (request: any, context: any) => handleItemPostingProfilesDeactivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  batchActivate: {
    method: "POST",
    path: "/organization/inventory/item-posting-profiles/batch-activate",
    handler: (request: any) => handleItemPostingProfilesBatchActivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
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
    path: "/organization/inventory/item-posting-profiles/batch-deactivate",
    handler: (request: any) => handleItemPostingProfilesBatchDeactivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
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
