import Type from "typebox";
import { BusinessRuleErrorResponseDto, CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ItemPostingProfileResponseDto } from "./types/item-posting-profile.response.dto";
import { ItemPostingProfilePatchRequestDto } from "./types/item-posting-profile.patch.request.dto";
import { ItemPostingProfileUpdateRequestDto } from "./types/item-posting-profile.update.request.dto";
import { ItemPostingProfileCreateRequestDto } from "./types/item-posting-profile.create.request.dto";
import { ItemPostingProfileBatchPatchRequestDto } from "./types/item-posting-profile.batch-patch.request.dto";
import { ItemPostingProfileBatchUpdateRequestDto } from "./types/item-posting-profile.batch-update.request.dto";



export const httpApiRoutes = {
  "ledger.inventory-item-posting-profiles.list": {
    description: "List Company Inventory Item Posting Profiles.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ItemPostingProfileResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "ledger.inventory-item-posting-profiles.filter": {
    description: "Filter Company Inventory Item Posting Profiles.",
    method: "POST",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/filter",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  "ledger.inventory-item-posting-profiles.search": {
    description: "Search Company Inventory Item Posting Profiles.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/search",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match item posting profile records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  "ledger.inventory-item-posting-profiles.batchGet": {
    description: "Batch Get Company Inventory Item Posting Profiles.",
    method: "POST",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/batch/get",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  "ledger.inventory-item-posting-profiles.batchCreate": {
    description: "Batch Create Company Inventory Item Posting Profiles.",
    method: "POST",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/batch/create",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(ItemPostingProfileCreateRequestDto) },
    summary: "Batch Create",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  "ledger.inventory-item-posting-profiles.batchUpdate": {
    description: "Batch Update Company Inventory Item Posting Profiles.",
    method: "PUT",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/batch",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(ItemPostingProfileBatchUpdateRequestDto) },
    summary: "Batch Update",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  "ledger.inventory-item-posting-profiles.batchPatch": {
    description: "Batch Patch Company Inventory Item Posting Profiles.",
    method: "PATCH",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/batch",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(ItemPostingProfileBatchPatchRequestDto) },
    summary: "Batch Patch",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(ItemPostingProfileResponseDto) } }
  },
  "ledger.inventory-item-posting-profiles.batchDelete": {
    description: "Batch Delete Company Inventory Item Posting Profiles.",
    method: "DELETE",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/batch",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    
    
    responses: { "204": { description: "Successful response." } }
  },
  "ledger.inventory-item-posting-profiles.create": {
    description: "Create Company Inventory Item Posting Profiles.",
    method: "POST",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: ItemPostingProfileCreateRequestDto },
    summary: "Create",
    
    
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
  "ledger.inventory-item-posting-profiles.get": {
    description: "Get Company Inventory Item Posting Profiles.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/[code]",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  "ledger.inventory-item-posting-profiles.update": {
    description: "Update Company Inventory Item Posting Profiles.",
    method: "PUT",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/[code]",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ItemPostingProfileUpdateRequestDto },
    summary: "Update",
    
    
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
  "ledger.inventory-item-posting-profiles.patch": {
    description: "Patch Company Inventory Item Posting Profiles.",
    method: "PATCH",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/[code]",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ItemPostingProfilePatchRequestDto },
    summary: "Patch",
    
    
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
  "ledger.inventory-item-posting-profiles.delete": {
    description: "Delete Company Inventory Item Posting Profiles.",
    method: "DELETE",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/[code]",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    
    
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "ledger.inventory-item-posting-profiles.activate": {
    description: "Activate Company Inventory Item Posting Profiles.",
    method: "POST",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/[code]/activate",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    
    
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  "ledger.inventory-item-posting-profiles.deactivate": {
    description: "Deactivate Company Inventory Item Posting Profiles.",
    method: "POST",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/[code]/deactivate",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    
    
    responses: { "200": { description: "Successful response.", body: ItemPostingProfileResponseDto } }
  },
  "ledger.inventory-item-posting-profiles.batchActivate": {
    description: "Batch Activate Company Inventory Item Posting Profiles.",
    method: "POST",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/batch-activate",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    
    
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
  "ledger.inventory-item-posting-profiles.batchDeactivate": {
    description: "Batch Deactivate Company Inventory Item Posting Profiles.",
    method: "POST",
    path: "/ledger/[companyCode]/inventory/item-posting-profiles/batch-deactivate",
    loadHandler: () => import("./server/http-api/item-posting-profile.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    
    
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
