import Type from "typebox";
import { handleActivate as handleActivateDimension, handleBatchActivate as handleBatchActivateDimensions, handleBatchCreate as handleBatchCreateDimensions, handleBatchDeactivate as handleBatchDeactivateDimensions, handleBatchDelete as handleBatchDeleteDimensions, handleBatchGet as handleBatchGetDimensions, handleBatchPatch as handleBatchPatchDimensions, handleBatchUpdate as handleBatchUpdateDimensions, handleCreate as handleCreateDimension, handleCreateValue as handleCreateDimensionValue, handleDeactivate as handleDeactivateDimension, handleDelete as handleDeleteDimension, handleDeleteValue as handleDeleteDimensionValue, handleFilter as handleFilterDimensions, handleGet as handleGetDimension, handleList as handleListDimensions, handleListValues as handleListDimensionValues, handlePatch as handlePatchDimension, handlePatchValue as handlePatchDimensionValue, handleSearch as handleSearchDimensions, handleUpdate as handleUpdateDimension } from "@voyzu/core/common/dimensions/server";
import { CompanyDimensionsListPage, CompanyDimensionDetailPage } from "@voyzu/core/company-dimensions/server";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { DimensionValueResponseDto } from "../../types/modules/dimensions/dimension-value.response.dto";
import { DimensionValuePatchRequestDto } from "../../types/modules/dimensions/dimension-value.patch.request.dto";
import { DimensionValueCreateRequestDto } from "../../types/modules/dimensions/dimension-value.create.request.dto";
import { DimensionResponseDto } from "../../types/modules/dimensions/dimension.response.dto";
import { DimensionPatchRequestDto } from "../../types/modules/dimensions/dimension.patch.request.dto";
import { DimensionUpdateRequestDto } from "../../types/modules/dimensions/dimension.update.request.dto";
import { DimensionBatchPatchRequestDto } from "../../types/modules/dimensions/dimension.batch-patch.request.dto";
import { DimensionBatchUpdateRequestDto } from "../../types/modules/dimensions/dimension.batch-update.request.dto";
import { DimensionCreateRequestDto } from "../../types/modules/dimensions/dimension.create.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/dimensions",
    handler: (request: any) => handleListDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: { "200": { description: "Successful response.", body: Type.Array(DimensionResponseDto) } }
  },
  filter: {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/filter",
    handler: (request: any) => handleFilterDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/search",
    handler: (request: any) => handleSearchDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company dimension records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/dimensions",
    handler: (request: any) => handleCreateDimension(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionCreateRequestDto },
    summary: "Create",
    description: "Create Company Dimensions.",
    tags: ["Company Dimensions"],
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
  batchCreate: {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/batch/create",
    handler: (request: any) => handleBatchCreateDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(DimensionCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/batch/get",
    handler: (request: any) => handleBatchGetDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/batch/update",
    handler: (request: any) => handleBatchUpdateDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(DimensionBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/batch/patch",
    handler: (request: any) => handleBatchPatchDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(DimensionBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/batch/delete",
    handler: (request: any) => handleBatchDeleteDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: {
      "204": { description: "Successful response." },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/batch-activate",
    handler: (request: any) => handleBatchActivateDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/batch-deactivate",
    handler: (request: any) => handleBatchDeactivateDimensions(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/[code]/activate",
    handler: (request: any, context: any) => handleActivateDimension(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: {
      "200": { description: "Successful response.", body: DimensionResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deactivate: {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/[code]/deactivate",
    handler: (request: any, context: any) => handleDeactivateDimension(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: {
      "200": { description: "Successful response.", body: DimensionResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/dimensions/[code]",
    handler: (request: any, context: any) => handleGetDimension(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: { "200": { description: "Successful response.", body: DimensionResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/[companyCode]/dimensions/[code]",
    handler: (request: any, context: any) => handleUpdateDimension(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionUpdateRequestDto },
    summary: "Update",
    description: "Update Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/[code]",
    handler: (request: any, context: any) => handlePatchDimension(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionPatchRequestDto },
    summary: "Patch",
    description: "Patch Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/[code]",
    handler: (request: any, context: any) => handleDeleteDimension(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  listValues: {
    method: "GET",
    path: "/finance/[companyCode]/dimensions/[code]/values",
    handler: (request: any, context: any) => handleListDimensionValues(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "List Values",
    description: "List Values Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: { "200": { description: "Successful response.", body: Type.Array(DimensionValueResponseDto) } }
  },
  createValue: {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/[code]/values",
    handler: (request: any, context: any) => handleCreateDimensionValue(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionValueCreateRequestDto },
    summary: "Create Value",
    description: "Create Value Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/values/[id]",
    handler: (request: any, context: any) => handlePatchDimensionValue(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionValuePatchRequestDto },
    summary: "Patch Value",
    description: "Patch Value Company Dimensions.",
    tags: ["Company Dimensions"],
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
    path: "/finance/[companyCode]/dimensions/values/[id]",
    handler: (request: any, context: any) => handleDeleteDimensionValue(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } } },
    summary: "Delete Value",
    description: "Delete Value Company Dimensions.",
    tags: ["Company Dimensions"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
