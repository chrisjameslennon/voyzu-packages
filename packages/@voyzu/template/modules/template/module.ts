import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import {
  handleActivate,
  handleBatchActivate,
  handleBatchCreate,
  handleBatchDeactivate,
  handleBatchDelete,
  handleBatchGet,
  handleBatchPatch,
  handleBatchUpdate,
  handleCreate,
  handleDeactivate,
  handleDelete,
  handleFilter,
  handleGet,
  handleList,
  handlePatch,
  handleSearch,
  handleUpdate,
} from "./server";
import { TemplateDetailPage } from "./server/pages/TemplateDetailPage";
import { TemplatesListPage } from "./server/pages/TemplatesListPage";

const tag = ["Template"];
const commonResponses = {
  "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
} as const;
const validationResponse = { "400": { description: "The request is invalid.", schema: dtoRef("InputValidationErrorResponseDto") } } as const;
const notFoundResponse = { "404": { description: "A requested template was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") } } as const;
const businessRuleResponse = { "422": { description: "A business rule blocked the operation.", schema: dtoRef("BusinessRuleErrorResponseDto") } } as const;
const codePathParameter = {
  code: { description: "The globally unique template business code.", schema: { type: "string" } },
} as const;

export const templateModule = {
  pageRoutes: {
    list: {
      id: "voyzu.template.page.list",
      path: "/template",
      Page: TemplatesListPage,
      pageTitle: "Template",
      helpPath: "voyzu-platform-guide/develop-a-new-package",
      breadcrumbBase: [],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
    detail: {
      id: "voyzu.template.page.detail",
      path: "/template/[code]",
      Page: TemplateDetailPage,
      pageTitle: "Template",
      helpPath: "voyzu-platform-guide/develop-a-new-package",
      breadcrumbBase: [{ label: "Template", href: "/template" }],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
  },
  apiDefinitions: {
    list: {
      method: "GET", path: "/template", handler: (request: any) => handleList(request),
      apiDoc: { summary: "List", description: "Lists all template records.", tags: tag, responses: { "200": { description: "All template records.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...commonResponses } },
    },
    create: {
      method: "POST", path: "/template", handler: (request: any) => handleCreate(request),
      apiDoc: { summary: "Create", description: "Creates a template record.", tags: tag, requestBody: { required: true, schema: dtoRef("TemplateCreateRequestDto") }, responses: { "201": { description: "Created template.", schema: dtoRef("TemplateResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "409": { description: "Code already exists.", schema: dtoRef("ConflictErrorResponseDto") }, ...commonResponses } },
    },
    filter: {
      method: "POST", path: "/template/filter", handler: (request: any) => handleFilter(request),
      apiDoc: { summary: "Filter templates", description: "Returns templates matching the supplied filter criteria.", tags: tag, requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Filtered templates.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...validationResponse, ...commonResponses } },
    },
    search: {
      method: "GET", path: "/template/search", handler: (request: any) => handleSearch(request),
      apiDoc: { summary: "Search templates", description: "Searches template codes and descriptions.", tags: tag, requestQuerystringParams: { q: { description: "Search text.", schema: { type: "string" } } }, responses: { "200": { description: "Matching templates.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...validationResponse, ...commonResponses } },
    },
    batchCreate: {
      method: "POST", path: "/template/batch/create", handler: (request: any) => handleBatchCreate(request),
      apiDoc: { summary: "Batch create templates", description: "Creates multiple templates in one transaction.", tags: tag, requestBody: { required: true, schema: arrayOf(dtoRef("TemplateCreateRequestDto")) }, responses: { "201": { description: "Created templates.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...validationResponse, "409": { description: "One or more codes already exist.", schema: dtoRef("ConflictErrorResponseDto") }, ...commonResponses } },
    },
    batchGet: {
      method: "POST", path: "/template/batch/get", handler: (request: any) => handleBatchGet(request),
      apiDoc: { summary: "Batch get templates", description: "Retrieves templates by business code.", tags: tag, requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Requested templates.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...validationResponse, ...commonResponses } },
    },
    batchUpdate: {
      method: "PUT", path: "/template/batch/update", handler: (request: any) => handleBatchUpdate(request),
      apiDoc: { summary: "Batch update templates", description: "Fully updates multiple templates in one transaction.", tags: tag, requestBody: { required: true, schema: arrayOf(dtoRef("TemplateBatchUpdateRequestDto")) }, responses: { "200": { description: "Updated templates.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...validationResponse, ...notFoundResponse, ...commonResponses } },
    },
    batchPatch: {
      method: "PATCH", path: "/template/batch/patch", handler: (request: any) => handleBatchPatch(request),
      apiDoc: { summary: "Batch patch templates", description: "Partially updates multiple templates in one transaction.", tags: tag, requestBody: { required: true, schema: arrayOf(dtoRef("TemplateBatchPatchRequestDto")) }, responses: { "200": { description: "Patched templates.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...validationResponse, ...notFoundResponse, ...commonResponses } },
    },
    batchDelete: {
      method: "POST", path: "/template/batch/delete", handler: (request: any) => handleBatchDelete(request),
      apiDoc: { summary: "Batch Delete", description: "Deletes template records.", tags: tag, requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Templates deleted." }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses } },
    },
    batchActivate: {
      method: "POST", path: "/template/batch/activate", handler: (request: any) => handleBatchActivate(request),
      apiDoc: { summary: "Batch Activate", description: "Activates template records.", tags: tag, requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Activated templates.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses } },
    },
    batchDeactivate: {
      method: "POST", path: "/template/batch/deactivate", handler: (request: any) => handleBatchDeactivate(request),
      apiDoc: { summary: "Batch Deactivate", description: "Deactivates template records.", tags: tag, requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Deactivated templates.", schema: arrayOf(dtoRef("TemplateResponseDto")) }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses } },
    },
    get: {
      method: "GET", path: "/template/[code]", handler: (request: any, context: any) => handleGet(request, context),
      apiDoc: { summary: "Get", description: "Gets a template by code.", tags: tag, requestPathParams: codePathParameter, responses: { "200": { description: "Requested template.", schema: dtoRef("TemplateResponseDto") }, ...validationResponse, ...notFoundResponse, ...commonResponses } },
    },
    update: {
      method: "PUT", path: "/template/[code]", handler: (request: any, context: any) => handleUpdate(request, context),
      apiDoc: { summary: "Update template", description: "Fully updates a template.", tags: tag, requestPathParams: codePathParameter, requestBody: { required: true, schema: dtoRef("TemplateUpdateRequestDto") }, responses: { "200": { description: "Updated template.", schema: dtoRef("TemplateResponseDto") }, ...validationResponse, ...notFoundResponse, ...commonResponses } },
    },
    patch: {
      method: "PATCH", path: "/template/[code]", handler: (request: any, context: any) => handlePatch(request, context),
      apiDoc: { summary: "Patch", description: "Updates a template description.", tags: tag, requestPathParams: codePathParameter, requestBody: { required: true, schema: dtoRef("TemplatePatchRequestDto") }, responses: { "200": { description: "Updated template.", schema: dtoRef("TemplateResponseDto") }, ...validationResponse, ...notFoundResponse, ...commonResponses } },
    },
    delete: {
      method: "DELETE", path: "/template/[code]", handler: (request: any, context: any) => handleDelete(request, context),
      apiDoc: { summary: "Delete", description: "Deletes a template.", tags: tag, requestPathParams: codePathParameter, responses: { "204": { description: "Template deleted." }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses } },
    },
    activate: {
      method: "POST", path: "/template/[code]/activate", handler: (request: any, context: any) => handleActivate(request, context),
      apiDoc: { summary: "Activate", description: "Activates a template.", tags: tag, requestPathParams: codePathParameter, responses: { "200": { description: "Activated template.", schema: dtoRef("TemplateResponseDto") }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses } },
    },
    deactivate: {
      method: "POST", path: "/template/[code]/deactivate", handler: (request: any, context: any) => handleDeactivate(request, context),
      apiDoc: { summary: "Deactivate", description: "Deactivates a template.", tags: tag, requestPathParams: codePathParameter, responses: { "200": { description: "Deactivated template.", schema: dtoRef("TemplateResponseDto") }, ...validationResponse, ...notFoundResponse, ...businessRuleResponse, ...commonResponses } },
    },
  },
} as const satisfies VoyzuPackageModuleDefinition;

export default templateModule;
