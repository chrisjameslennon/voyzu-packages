import Type from "typebox";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { DimensionResponseDto } from "../../types/modules/dimensions/dimension.response.dto";
import { DimensionPatchRequestDto } from "../../types/modules/dimensions/dimension.patch.request.dto";
import { DimensionUpdateRequestDto } from "../../types/modules/dimensions/dimension.update.request.dto";
import { DimensionValueResponseDto } from "../../types/modules/dimensions/dimension-value.response.dto";
import { DimensionValuePatchRequestDto } from "../../types/modules/dimensions/dimension-value.patch.request.dto";
import { DimensionValueCreateRequestDto } from "../../types/modules/dimensions/dimension-value.create.request.dto";
import { DimensionBatchPatchRequestDto } from "../../types/modules/dimensions/dimension.batch-patch.request.dto";
import { DimensionBatchUpdateRequestDto } from "../../types/modules/dimensions/dimension.batch-update.request.dto";
import { DimensionCreateRequestDto } from "../../types/modules/dimensions/dimension.create.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/dimensions",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleList),
    summary: "List",
    description: "List Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: { "200": { description: "Successful response.", body: Type.Array(DimensionResponseDto) } }
  },
  create: {
    method: "POST",
    path: "/finance/dimensions",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleCreate),
    request: { contentType: "application/json", body: DimensionCreateRequestDto },
    summary: "Create",
    description: "Create Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  filter: {
    method: "POST",
    path: "/finance/dimensions/filter",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleFilter),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  search: {
    method: "GET",
    path: "/finance/dimensions/search",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleSearch),
    request: { query: { parameters: { q: { description: "Search text used to match organization dimension records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/dimensions/batch/create",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleBatchCreate),
    request: { contentType: "application/json", body: Type.Array(DimensionCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchGet: {
    method: "POST",
    path: "/finance/dimensions/batch/get",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleBatchGet),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchUpdate: {
    method: "PUT",
    path: "/finance/dimensions/batch/update",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleBatchUpdate),
    request: { contentType: "application/json", body: Type.Array(DimensionBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchPatch: {
    method: "PATCH",
    path: "/finance/dimensions/batch/patch",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleBatchPatch),
    request: { contentType: "application/json", body: Type.Array(DimensionBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDelete: {
    method: "POST",
    path: "/finance/dimensions/batch/delete",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleBatchDelete),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "204": { description: "Successful response." },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/dimensions/batch-activate",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleBatchActivate),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDeactivate: {
    method: "POST",
    path: "/finance/dimensions/batch-deactivate",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST",
    path: "/finance/dimensions/[code]/activate",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleActivate),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": { description: "Successful response.", body: DimensionResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deactivate: {
    method: "POST",
    path: "/finance/dimensions/[code]/deactivate",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": { description: "Successful response.", body: DimensionResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  listValues: {
    method: "GET",
    path: "/finance/dimensions/[code]/values",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleListValues),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "List Values",
    description: "List Values Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: { "200": { description: "Successful response.", body: Type.Array(DimensionValueResponseDto) } }
  },
  createValue: {
    method: "POST",
    path: "/finance/dimensions/[code]/values",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleCreateValue),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionValueCreateRequestDto },
    summary: "Create Value",
    description: "Create Value Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionValueResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "A dimension value with this name already exists.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patchValue: {
    method: "PATCH",
    path: "/finance/dimensions/values/[id]",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handlePatchValue),
    request: { path: { id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionValuePatchRequestDto },
    summary: "Patch Value",
    description: "Patch Value Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionValueResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "A dimension value with this name already exists.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deleteValue: {
    method: "DELETE",
    path: "/finance/dimensions/values/[id]",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleDeleteValue),
    request: { path: { id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } } },
    summary: "Delete Value",
    description: "Delete Value Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  get: {
    method: "GET",
    path: "/finance/dimensions/[code]",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleGet),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: { "200": { description: "Successful response.", body: DimensionResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/dimensions/[code]",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleUpdate),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionUpdateRequestDto },
    summary: "Update",
    description: "Update Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/dimensions/[code]",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handlePatch),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  delete: {
    method: "DELETE",
    path: "/finance/dimensions/[code]",
    loadHandler: () => import("../common/dimensions/server/api/dimension.http.handlers").then((module) => module.handleDelete),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization Dimensions.",
    tags: ["Organization Dimensions"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
