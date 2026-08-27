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
  TemplateBatchPatchRequestDto,
  TemplateBatchUpdateRequestDto,
  TemplateCreateRequestDto,
  TemplatePatchRequestDto,
  TemplateResponseDto,
  TemplateUpdateRequestDto,
} from "../types";
const loadHandlers = () => import("./server/api/template.http.handlers");

const tag = ["Template"];
const commonResponses = {
  "401": { description: "Authentication failed.", body: UnauthorizedErrorResponseDto },
  "403": { description: "Access is forbidden.", body: ForbiddenErrorResponseDto },
  "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
} as const;
const validationResponse = { "400": { description: "The request is invalid.", body: InputValidationErrorResponseDto } } as const;
const notFoundResponse = { "404": { description: "A requested template was not found.", body: EntityNotFoundErrorResponseDto } } as const;
const businessRuleResponse = { "422": { description: "A business rule blocked the operation.", body: BusinessRuleErrorResponseDto } } as const;
const codePathParameter = {
  code: {
    description: "The globally unique template business code.",
    schema: Type.String({ maxLength: 40, pattern: "^[A-Z0-9][A-Z0-9_-]*$" }),
  },
} as const;

export const apiDefinitions = {
  list: {
    method: "GET", path: "/template", loadHandler: () => loadHandlers().then((module) => module.handleList),
    summary: "List", description: "Lists all template records.", tags: tag,
    responses: { "200": { description: "All template records.", body: Type.Array(TemplateResponseDto) }, ...commonResponses },
  },
  create: {
    method: "POST", path: "/template", loadHandler: () => loadHandlers().then((module) => module.handleCreate),
    request: { contentType: "application/json", body: TemplateCreateRequestDto },
    summary: "Create", description: "Creates a template record.", tags: tag,
    responses: {
      "201": { description: "Created template.", body: TemplateResponseDto },
      ...validationResponse,
      "409": { description: "Code already exists.", body: ConflictErrorResponseDto },
      ...commonResponses,
    },
  },
  filter: {
    method: "POST", path: "/template/filter", loadHandler: () => loadHandlers().then((module) => module.handleFilter),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter templates", description: "Returns templates matching the supplied filter criteria.", tags: tag,
    responses: { "200": { description: "Filtered templates.", body: Type.Array(TemplateResponseDto) }, ...validationResponse, ...commonResponses },
  },
  search: {
    method: "GET", path: "/template/search", loadHandler: () => loadHandlers().then((module) => module.handleSearch),
    request: {
      query: {
        parameters: { q: { description: "Search text.", required: true } },
        schema: Type.Object({ q: Type.String({ pattern: "\\S" }) }),
      },
    },
    summary: "Search templates", description: "Searches template codes and descriptions.", tags: tag,
    responses: { "200": { description: "Matching templates.", body: Type.Array(TemplateResponseDto) }, ...validationResponse, ...commonResponses },
  },
  batchCreate: {
    method: "POST", path: "/template/batch/create", loadHandler: () => loadHandlers().then((module) => module.handleBatchCreate),
    request: { contentType: "application/json", body: Type.Array(TemplateCreateRequestDto, { minItems: 1 }) },
    summary: "Batch create templates", description: "Creates multiple templates in one transaction.", tags: tag,
    responses: {
      "201": { description: "Created templates.", body: Type.Array(TemplateResponseDto) },
      ...validationResponse,
      "409": { description: "One or more codes already exist.", body: ConflictErrorResponseDto },
      ...commonResponses,
    },
  },
  batchGet: {
    method: "POST", path: "/template/batch/get", loadHandler: () => loadHandlers().then((module) => module.handleBatchGet),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch get templates", description: "Retrieves templates by business code.", tags: tag,
    responses: { "200": { description: "Requested templates.", body: Type.Array(TemplateResponseDto) }, ...validationResponse, ...commonResponses },
  },
  batchUpdate: {
    method: "PUT", path: "/template/batch/update", loadHandler: () => loadHandlers().then((module) => module.handleBatchUpdate),
    request: { contentType: "application/json", body: Type.Array(TemplateBatchUpdateRequestDto, { minItems: 1 }) },
    summary: "Batch update templates", description: "Fully updates multiple templates in one transaction.", tags: tag,
    responses: { "200": { description: "Updated templates.", body: Type.Array(TemplateResponseDto) }, ...validationResponse, ...notFoundResponse, ...commonResponses },
  },
  batchPatch: {
    method: "PATCH", path: "/template/batch/patch", loadHandler: () => loadHandlers().then((module) => module.handleBatchPatch),
    request: { contentType: "application/json", body: Type.Array(TemplateBatchPatchRequestDto, { minItems: 1 }) },
    summary: "Batch patch templates", description: "Partially updates multiple templates in one transaction.", tags: tag,
    responses: { "200": { description: "Patched templates.", body: Type.Array(TemplateResponseDto) }, ...validationResponse, ...notFoundResponse, ...commonResponses },
  },
  batchDelete: {
    method: "POST", path: "/template/batch/delete", loadHandler: () => loadHandlers().then((module) => module.handleBatchDelete),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete", description: "Deletes template records.", tags: tag,
    responses: { "204": { description: "Templates deleted." }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses },
  },
  batchActivate: {
    method: "POST", path: "/template/batch/activate", loadHandler: () => loadHandlers().then((module) => module.handleBatchActivate),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate", description: "Activates template records.", tags: tag,
    responses: { "200": { description: "Activated templates.", body: Type.Array(TemplateResponseDto) }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses },
  },
  batchDeactivate: {
    method: "POST", path: "/template/batch/deactivate", loadHandler: () => loadHandlers().then((module) => module.handleBatchDeactivate),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate", description: "Deactivates template records.", tags: tag,
    responses: { "200": { description: "Deactivated templates.", body: Type.Array(TemplateResponseDto) }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses },
  },
  get: {
    method: "GET", path: "/template/[code]", loadHandler: () => loadHandlers().then((module) => module.handleGet),
    request: { path: codePathParameter },
    summary: "Get", description: "Gets a template by code.", tags: tag,
    responses: { "200": { description: "Requested template.", body: TemplateResponseDto }, ...notFoundResponse, ...commonResponses },
  },
  update: {
    method: "PUT", path: "/template/[code]", loadHandler: () => loadHandlers().then((module) => module.handleUpdate),
    request: { path: codePathParameter, contentType: "application/json", body: TemplateUpdateRequestDto },
    summary: "Update template", description: "Fully updates a template.", tags: tag,
    responses: { "200": { description: "Updated template.", body: TemplateResponseDto }, ...validationResponse, ...notFoundResponse, ...commonResponses },
  },
  patch: {
    method: "PATCH", path: "/template/[code]", loadHandler: () => loadHandlers().then((module) => module.handlePatch),
    request: { path: codePathParameter, contentType: "application/json", body: TemplatePatchRequestDto },
    summary: "Patch", description: "Updates a template description.", tags: tag,
    responses: { "200": { description: "Updated template.", body: TemplateResponseDto }, ...validationResponse, ...notFoundResponse, ...commonResponses },
  },
  delete: {
    method: "DELETE", path: "/template/[code]", loadHandler: () => loadHandlers().then((module) => module.handleDelete),
    request: { path: codePathParameter },
    summary: "Delete", description: "Deletes a template.", tags: tag,
    responses: { "204": { description: "Template deleted." }, ...notFoundResponse, ...businessRuleResponse, ...commonResponses },
  },
  activate: {
    method: "POST", path: "/template/[code]/activate", loadHandler: () => loadHandlers().then((module) => module.handleActivate),
    request: { path: codePathParameter },
    summary: "Activate", description: "Activates a template.", tags: tag,
    responses: { "200": { description: "Activated template.", body: TemplateResponseDto }, ...notFoundResponse, ...businessRuleResponse, ...commonResponses },
  },
  deactivate: {
    method: "POST", path: "/template/[code]/deactivate", loadHandler: () => loadHandlers().then((module) => module.handleDeactivate),
    request: { path: codePathParameter },
    summary: "Deactivate", description: "Deactivates a template.", tags: tag,
    responses: { "200": { description: "Deactivated template.", body: TemplateResponseDto }, ...notFoundResponse, ...businessRuleResponse, ...commonResponses },
  },
} as const;
