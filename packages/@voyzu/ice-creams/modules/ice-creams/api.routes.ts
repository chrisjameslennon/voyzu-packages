import {
  BusinessRuleErrorResponseDto,
  CodesRequestDto,
  ConflictErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  FilterRequestDto,
  ForbiddenErrorResponseDto,
  InputValidationErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from "@voyzu/types";
import Type from "typebox";
import {
  IceCreamBatchPatchRequestDto,
  IceCreamBatchUpdateRequestDto,
  IceCreamCreateRequestDto,
  IceCreamFlavorResponseDto,
  IceCreamPatchRequestDto,
  IceCreamResponseDto,
  IceCreamUpdateRequestDto,
} from "@voyzu/ice-creams/types";
const loadHandlers = () => import("./server/api/ice-cream.http.handlers");

const tag = ["Ice Creams"];

const commonResponses = {
  "401": {
    description: "Authentication failed.",
    body: UnauthorizedErrorResponseDto,
  },
  "403": {
    description: "Access is forbidden.",
    body: ForbiddenErrorResponseDto,
  },
  "500": {
    description: "An unexpected server error occurred.",
    body: InternalServerErrorResponseDto,
  },
} as const;

const codePathParameter = {
  code: {
    description: "The globally unique ice-cream business code.",
    schema: Type.String({ pattern: "^[A-Z0-9][A-Z0-9_-]*$" }),
  },
} as const;

export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/ice-creams",
    loadHandler: () => loadHandlers().then((module) => module.handleList),
    summary: "List",
    description: "Lists all ice creams.",
    tags: tag,
    responses: {
      "200": { description: "All ice creams.", body: Type.Array(IceCreamResponseDto) },
      ...commonResponses,
    }
  },
  create: {
    method: "POST",
    path: "/ice-creams",
    loadHandler: () => loadHandlers().then((module) => module.handleCreate),
    request: { contentType: "application/json", body: IceCreamCreateRequestDto },
    summary: "Create",
    description: "Creates an active ice cream.",
    tags: tag,
    responses: {
      "201": { description: "The created ice cream.", body: IceCreamResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "The selected flavour was not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "The code already exists.", body: ConflictErrorResponseDto },
      "422": { description: "The selected flavour is inactive.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  flavors: {
    method: "GET",
    path: "/ice-creams/flavors",
    loadHandler: () => loadHandlers().then((module) => module.handleListFlavors),
    summary: "List Flavours",
    description: "Lists reference flavours available to ice creams.",
    tags: tag,
    responses: {
      "200": { description: "Ice-cream flavours.", body: Type.Array(IceCreamFlavorResponseDto) },
      ...commonResponses,
    }
  },
  filter: {
    method: "POST",
    path: "/ice-creams/queries",
    loadHandler: () => loadHandlers().then((module) => module.handleFilter),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filters ice creams using the shared filter contract.",
    tags: tag,
    responses: {
      "200": { description: "Filtered ice creams.", body: Type.Array(IceCreamResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      ...commonResponses,
    }
  },
  search: {
    method: "GET",
    path: "/ice-creams/search-results",
    loadHandler: () => loadHandlers().then((module) => module.handleSearch),
    request: {
      query: {
        parameters: {
          q: { description: "Search text.", required: true },
        },
        schema: Type.Object({ q: Type.String({ pattern: "\\S" }) }),
      },
    },
    summary: "Search",
    description: "Searches code, name, flavour and supplier.",
    tags: tag,
    responses: {
      "200": { description: "Matching ice creams.", body: Type.Array(IceCreamResponseDto) },
      "400": { description: "Search text was not supplied.", body: InputValidationErrorResponseDto },
      ...commonResponses,
    }
  },
  batchGet: {
    method: "POST",
    path: "/ice-creams/selections",
    loadHandler: () => loadHandlers().then((module) => module.handleBatchGet),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Gets ice creams by business code.",
    tags: tag,
    responses: {
      "200": { description: "Requested ice creams.", body: Type.Array(IceCreamResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      ...commonResponses,
    }
  },
  batchCreate: {
    method: "POST",
    path: "/ice-creams/batches",
    loadHandler: () => loadHandlers().then((module) => module.handleBatchCreate),
    request: { contentType: "application/json", body: Type.Array(IceCreamCreateRequestDto, { minItems: 1 }) },
    summary: "Batch Create",
    description: "Creates ice creams atomically with one audit mutation.",
    tags: tag,
    responses: {
      "201": { description: "Created ice creams.", body: Type.Array(IceCreamResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "A selected flavour was not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "One or more codes already exist.", body: ConflictErrorResponseDto },
      "422": { description: "A selected flavour is inactive.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  batchUpdate: {
    method: "PUT",
    path: "/ice-creams/batches",
    loadHandler: () => loadHandlers().then((module) => module.handleBatchUpdate),
    request: { contentType: "application/json", body: Type.Array(IceCreamBatchUpdateRequestDto, { minItems: 1 }) },
    summary: "Batch Update",
    description: "Fully updates ice creams atomically.",
    tags: tag,
    responses: {
      "200": { description: "Updated ice creams.", body: Type.Array(IceCreamResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "An ice cream or flavour was not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "A selected flavour is inactive.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  batchPatch: {
    method: "PATCH",
    path: "/ice-creams/batches",
    loadHandler: () => loadHandlers().then((module) => module.handleBatchPatch),
    request: { contentType: "application/json", body: Type.Array(IceCreamBatchPatchRequestDto, { minItems: 1 }) },
    summary: "Batch Patch",
    description: "Partially updates ice creams atomically.",
    tags: tag,
    responses: {
      "200": { description: "Patched ice creams.", body: Type.Array(IceCreamResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "An ice cream or flavour was not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "A selected flavour is inactive.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  batchDelete: {
    method: "DELETE",
    path: "/ice-creams/batches",
    loadHandler: () => loadHandlers().then((module) => module.handleBatchDelete),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Deletes ice creams atomically after stamping deletion audit metadata.",
    tags: tag,
    responses: {
      "204": { description: "Ice creams deleted." },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "One or more ice creams were not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Deletion is blocked.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  batchActivate: {
    method: "PUT",
    path: "/ice-creams/batches/activation",
    loadHandler: () => loadHandlers().then((module) => module.handleBatchActivate),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Activates ice creams atomically.",
    tags: tag,
    responses: {
      "200": { description: "Activated ice creams.", body: Type.Array(IceCreamResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "One or more ice creams were not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "A transition is blocked.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  batchDeactivate: {
    method: "DELETE",
    path: "/ice-creams/batches/activation",
    loadHandler: () => loadHandlers().then((module) => module.handleBatchDeactivate),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Deactivates ice creams atomically.",
    tags: tag,
    responses: {
      "200": { description: "Deactivated ice creams.", body: Type.Array(IceCreamResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "One or more ice creams were not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "A transition is blocked.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  get: {
    method: "GET",
    path: "/ice-creams/[code]",
    loadHandler: () => loadHandlers().then((module) => module.handleGet),
    request: { path: codePathParameter },
    summary: "Get",
    description: "Gets an ice cream by business code.",
    tags: tag,
    responses: {
      "200": { description: "The requested ice cream.", body: IceCreamResponseDto },
      "404": { description: "Ice cream not found.", body: EntityNotFoundErrorResponseDto },
      ...commonResponses,
    }
  },
  update: {
    method: "PUT",
    path: "/ice-creams/[code]",
    loadHandler: () => loadHandlers().then((module) => module.handleUpdate),
    request: { path: codePathParameter, contentType: "application/json", body: IceCreamUpdateRequestDto },
    summary: "Update",
    description: "Fully updates the writable fields of an ice cream.",
    tags: tag,
    responses: {
      "200": { description: "Updated ice cream.", body: IceCreamResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Ice cream or flavour not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "The selected flavour is inactive.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  patch: {
    method: "PATCH",
    path: "/ice-creams/[code]",
    loadHandler: () => loadHandlers().then((module) => module.handlePatch),
    request: { path: codePathParameter, contentType: "application/json", body: IceCreamPatchRequestDto },
    summary: "Patch",
    description: "Partially updates the writable fields of an ice cream.",
    tags: tag,
    responses: {
      "200": { description: "Patched ice cream.", body: IceCreamResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Ice cream or flavour not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "The selected flavour is inactive.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  delete: {
    method: "DELETE",
    path: "/ice-creams/[code]",
    loadHandler: () => loadHandlers().then((module) => module.handleDelete),
    request: { path: codePathParameter },
    summary: "Delete",
    description: "Deletes an ice cream after stamping deletion audit metadata.",
    tags: tag,
    responses: {
      "204": { description: "Ice cream deleted." },
      "404": { description: "Ice cream not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "Deletion is blocked.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  activate: {
    method: "PUT",
    path: "/ice-creams/[code]/activation",
    loadHandler: () => loadHandlers().then((module) => module.handleActivate),
    request: { path: codePathParameter },
    summary: "Activate",
    description: "Activates an ice cream.",
    tags: tag,
    responses: {
      "200": { description: "Activated ice cream.", body: IceCreamResponseDto },
      "404": { description: "Ice cream not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "The ice cream is already active.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
  deactivate: {
    method: "DELETE",
    path: "/ice-creams/[code]/activation",
    loadHandler: () => loadHandlers().then((module) => module.handleDeactivate),
    request: { path: codePathParameter },
    summary: "Deactivate",
    description: "Deactivates an ice cream.",
    tags: tag,
    responses: {
      "200": { description: "Deactivated ice cream.", body: IceCreamResponseDto },
      "404": { description: "Ice cream not found.", body: EntityNotFoundErrorResponseDto },
      "422": { description: "The ice cream is already inactive.", body: BusinessRuleErrorResponseDto },
      ...commonResponses,
    }
  },
} as const;
