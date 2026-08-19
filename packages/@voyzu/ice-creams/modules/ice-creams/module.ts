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
  handleListFlavors,
  handlePatch,
  handleSearch,
  handleUpdate,
} from "./server";
import { IceCreamDetailPage } from "./server/pages/IceCreamDetailPage";
import { IceCreamsListPage } from "./server/pages/IceCreamsListPage";

const tag = ["Ice Creams"];
const commonResponses = {
  "401": {
    description: "Authentication failed.",
    body: dtoRef("UnauthorizedErrorResponseDto"),
  },
  "403": {
    description: "Access is forbidden.",
    body: dtoRef("ForbiddenErrorResponseDto"),
  },
  "500": {
    description: "An unexpected server error occurred.",
    body: dtoRef("InternalServerErrorResponseDto"),
  },
} as const;
const codePathParameter = {
  code: {
    description: "The globally unique ice-cream business code.",
    schema: { type: "string" },
  },
} as const;

export const iceCreamsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.ice-creams.page.list",
      path: "/ice-creams",
      Page: IceCreamsListPage,
      pageTitle: "Ice Creams",
      helpPath: "voyzu-platform-guide/develop-a-new-package",
      breadcrumbBase: [],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
    detail: {
      id: "voyzu.ice-creams.page.detail",
      path: "/ice-creams/[code]",
      Page: IceCreamDetailPage,
      pageTitle: "Ice Cream",
      helpPath: "voyzu-platform-guide/develop-a-new-package",
      breadcrumbBase: [{ label: "Ice Creams", href: "/ice-creams" }],
      auth: { required: true, minRole: "ORGANIZATION_USER" },
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/ice-creams",
      handler: (request: any) => handleList(request),
      summary: "List",
      description: "Lists all ice creams.",
      tags: tag,
      responses: {
        "200": { description: "All ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        ...commonResponses,
      }
    },
    create: {
      method: "POST",
      path: "/ice-creams",
      handler: (request: any) => handleCreate(request),
      request: { contentType: "application/json", body: dtoRef("IceCreamCreateRequestDto") },
      summary: "Create",
      description: "Creates an active ice cream.",
      tags: tag,
      responses: {
        "201": { description: "The created ice cream.", body: dtoRef("IceCreamResponseDto") },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "The selected flavour was not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "409": { description: "The code already exists.", body: dtoRef("ConflictErrorResponseDto") },
        "422": { description: "The selected flavour is inactive.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    flavors: {
      method: "GET",
      path: "/ice-creams/flavors",
      handler: (request: any) => handleListFlavors(request),
      summary: "List Flavours",
      description: "Lists reference flavours available to ice creams.",
      tags: tag,
      responses: {
        "200": { description: "Ice-cream flavours.", body: arrayOf(dtoRef("IceCreamFlavorResponseDto")) },
        ...commonResponses,
      }
    },
    filter: {
      method: "POST",
      path: "/ice-creams/queries",
      handler: (request: any) => handleFilter(request),
      request: { contentType: "application/json", body: dtoRef("FilterRequestDto") },
      summary: "Filter",
      description: "Filters ice creams using the shared filter contract.",
      tags: tag,
      responses: {
        "200": { description: "Filtered ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        ...commonResponses,
      }
    },
    search: {
      method: "GET",
      path: "/ice-creams/search-results",
      handler: (request: any) => handleSearch(request),
      request: {
        query: {
          q: { description: "Search text.", required: true, schema: { type: "string" } },
        }
      },
      summary: "Search",
      description: "Searches code, name, flavour and supplier.",
      tags: tag,
      responses: {
        "200": { description: "Matching ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        "400": { description: "Search text was not supplied.", body: dtoRef("InputValidationErrorResponseDto") },
        ...commonResponses,
      }
    },
    batchGet: {
      method: "POST",
      path: "/ice-creams/selections",
      handler: (request: any) => handleBatchGet(request),
      request: { contentType: "application/json", body: dtoRef("CodesRequestDto") },
      summary: "Batch Get",
      description: "Gets ice creams by business code.",
      tags: tag,
      responses: {
        "200": { description: "Requested ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        ...commonResponses,
      }
    },
    batchCreate: {
      method: "POST",
      path: "/ice-creams/batches",
      handler: (request: any) => handleBatchCreate(request),
      request: { contentType: "application/json", body: arrayOf(dtoRef("IceCreamCreateRequestDto")) },
      summary: "Batch Create",
      description: "Creates ice creams atomically with one audit mutation.",
      tags: tag,
      responses: {
        "201": { description: "Created ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "A selected flavour was not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "409": { description: "One or more codes already exist.", body: dtoRef("ConflictErrorResponseDto") },
        "422": { description: "A selected flavour is inactive.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    batchUpdate: {
      method: "PUT",
      path: "/ice-creams/batches",
      handler: (request: any) => handleBatchUpdate(request),
      request: { contentType: "application/json", body: arrayOf(dtoRef("IceCreamBatchUpdateRequestDto")) },
      summary: "Batch Update",
      description: "Fully updates ice creams atomically.",
      tags: tag,
      responses: {
        "200": { description: "Updated ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "An ice cream or flavour was not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "A selected flavour is inactive.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    batchPatch: {
      method: "PATCH",
      path: "/ice-creams/batches",
      handler: (request: any) => handleBatchPatch(request),
      request: { contentType: "application/json", body: arrayOf(dtoRef("IceCreamBatchPatchRequestDto")) },
      summary: "Batch Patch",
      description: "Partially updates ice creams atomically.",
      tags: tag,
      responses: {
        "200": { description: "Patched ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "An ice cream or flavour was not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "A selected flavour is inactive.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    batchDelete: {
      method: "DELETE",
      path: "/ice-creams/batches",
      handler: (request: any) => handleBatchDelete(request),
      request: { contentType: "application/json", body: dtoRef("CodesRequestDto") },
      summary: "Batch Delete",
      description: "Deletes ice creams atomically after stamping deletion audit metadata.",
      tags: tag,
      responses: {
        "204": { description: "Ice creams deleted." },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "One or more ice creams were not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "Deletion is blocked.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    batchActivate: {
      method: "PUT",
      path: "/ice-creams/batches/activation",
      handler: (request: any) => handleBatchActivate(request),
      request: { contentType: "application/json", body: dtoRef("CodesRequestDto") },
      summary: "Batch Activate",
      description: "Activates ice creams atomically.",
      tags: tag,
      responses: {
        "200": { description: "Activated ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "One or more ice creams were not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "A transition is blocked.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    batchDeactivate: {
      method: "DELETE",
      path: "/ice-creams/batches/activation",
      handler: (request: any) => handleBatchDeactivate(request),
      request: { contentType: "application/json", body: dtoRef("CodesRequestDto") },
      summary: "Batch Deactivate",
      description: "Deactivates ice creams atomically.",
      tags: tag,
      responses: {
        "200": { description: "Deactivated ice creams.", body: arrayOf(dtoRef("IceCreamResponseDto")) },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "One or more ice creams were not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "A transition is blocked.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    get: {
      method: "GET",
      path: "/ice-creams/[code]",
      handler: (request: any, context: any) => handleGet(request, context),
      request: { path: codePathParameter },
      summary: "Get",
      description: "Gets an ice cream by business code.",
      tags: tag,
      responses: {
        "200": { description: "The requested ice cream.", body: dtoRef("IceCreamResponseDto") },
        "404": { description: "Ice cream not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        ...commonResponses,
      }
    },
    update: {
      method: "PUT",
      path: "/ice-creams/[code]",
      handler: (request: any, context: any) => handleUpdate(request, context),
      request: { path: codePathParameter, contentType: "application/json", body: dtoRef("IceCreamUpdateRequestDto") },
      summary: "Update",
      description: "Fully updates the writable fields of an ice cream.",
      tags: tag,
      responses: {
        "200": { description: "Updated ice cream.", body: dtoRef("IceCreamResponseDto") },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "Ice cream or flavour not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "The selected flavour is inactive.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    patch: {
      method: "PATCH",
      path: "/ice-creams/[code]",
      handler: (request: any, context: any) => handlePatch(request, context),
      request: { path: codePathParameter, contentType: "application/json", body: dtoRef("IceCreamPatchRequestDto") },
      summary: "Patch",
      description: "Partially updates the writable fields of an ice cream.",
      tags: tag,
      responses: {
        "200": { description: "Patched ice cream.", body: dtoRef("IceCreamResponseDto") },
        "400": { description: "Validation failed.", body: dtoRef("InputValidationErrorResponseDto") },
        "404": { description: "Ice cream or flavour not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "The selected flavour is inactive.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    delete: {
      method: "DELETE",
      path: "/ice-creams/[code]",
      handler: (request: any, context: any) => handleDelete(request, context),
      request: { path: codePathParameter },
      summary: "Delete",
      description: "Deletes an ice cream after stamping deletion audit metadata.",
      tags: tag,
      responses: {
        "204": { description: "Ice cream deleted." },
        "404": { description: "Ice cream not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "Deletion is blocked.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    activate: {
      method: "PUT",
      path: "/ice-creams/[code]/activation",
      handler: (request: any, context: any) => handleActivate(request, context),
      request: { path: codePathParameter },
      summary: "Activate",
      description: "Activates an ice cream.",
      tags: tag,
      responses: {
        "200": { description: "Activated ice cream.", body: dtoRef("IceCreamResponseDto") },
        "404": { description: "Ice cream not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "The ice cream is already active.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
    deactivate: {
      method: "DELETE",
      path: "/ice-creams/[code]/activation",
      handler: (request: any, context: any) => handleDeactivate(request, context),
      request: { path: codePathParameter },
      summary: "Deactivate",
      description: "Deactivates an ice cream.",
      tags: tag,
      responses: {
        "200": { description: "Deactivated ice cream.", body: dtoRef("IceCreamResponseDto") },
        "404": { description: "Ice cream not found.", body: dtoRef("EntityNotFoundErrorResponseDto") },
        "422": { description: "The ice cream is already inactive.", body: dtoRef("BusinessRuleErrorResponseDto") },
        ...commonResponses,
      }
    },
  },
} as const satisfies VoyzuPackageModuleDefinition;

export default iceCreamsModule;
