import Type from "typebox";
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
    path: "/finance/template/inventory/item-posting-profiles",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleList),
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
    path: "/finance/template/inventory/item-posting-profiles/filter",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleFilter),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  search: {
    method: "GET",
    path: "/finance/template/inventory/item-posting-profiles/search",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleSearch),
    request: { query: { parameters: { q: { description: "Search text used to match item posting profile records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchGet: {
    method: "POST",
    path: "/finance/template/inventory/item-posting-profiles/batch/get",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleBatchGet),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/template/inventory/item-posting-profiles/batch/create",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleBatchCreate),
    request: { contentType: "application/json", body: Type.Array(ItemPostingProfileCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchUpdate: {
    method: "PUT",
    path: "/finance/template/inventory/item-posting-profiles/batch",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleBatchUpdate),
    request: { contentType: "application/json", body: Type.Array(ItemPostingProfileBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchPatch: {
    method: "PATCH",
    path: "/finance/template/inventory/item-posting-profiles/batch",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleBatchPatch),
    request: { contentType: "application/json", body: Type.Array(ItemPostingProfileBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  batchDelete: {
    method: "DELETE",
    path: "/finance/template/inventory/item-posting-profiles/batch",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleBatchDelete),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "204": { description: "Successful response." } }
  },
  create: {
    method: "POST",
    path: "/finance/template/inventory/item-posting-profiles",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleCreate),
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
    path: "/finance/template/inventory/item-posting-profiles/[code]",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleGet),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/template/inventory/item-posting-profiles/[code]",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleUpdate),
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
    path: "/finance/template/inventory/item-posting-profiles/[code]",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handlePatch),
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
    path: "/finance/template/inventory/item-posting-profiles/[code]",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleDelete),
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
    path: "/finance/template/inventory/item-posting-profiles/[code]/activate",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleActivate),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  deactivate: {
    method: "POST",
    path: "/finance/template/inventory/item-posting-profiles/[code]/deactivate",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization Inventory Item Posting Profiles.",
    tags: ["Organization Inventory Item Posting Profiles"],
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/template/inventory/item-posting-profiles/batch-activate",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleBatchActivate),
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
    path: "/finance/template/inventory/item-posting-profiles/batch-deactivate",
    loadHandler: () => import("../common/inventory-item-posting-profiles/server/api/item-posting-profile.http.handlers").then((module) => module.handleBatchDeactivate),
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
