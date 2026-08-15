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
  "500": {
    description: "An unexpected server error occurred.",
    schema: dtoRef("InternalServerErrorResponseDto"),
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
      apiDoc: {
        summary: "List",
        description: "Lists all ice creams.",
        tags: tag,
        responses: {
          "200": { description: "All ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          ...commonResponses,
        },
      },
    },
    create: {
      method: "POST",
      path: "/ice-creams",
      handler: (request: any) => handleCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Creates an active ice cream.",
        tags: tag,
        requestBody: { required: true, schema: dtoRef("IceCreamCreateRequestDto") },
        responses: {
          "201": { description: "The created ice cream.", schema: dtoRef("IceCreamResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "The selected flavour was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "The code already exists.", schema: dtoRef("ConflictErrorResponseDto") },
          "422": { description: "The selected flavour is inactive.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    flavors: {
      method: "GET",
      path: "/ice-creams/flavors",
      handler: (request: any) => handleListFlavors(request),
      apiDoc: {
        summary: "List Flavours",
        description: "Lists reference flavours available to ice creams.",
        tags: tag,
        responses: {
          "200": { description: "Ice-cream flavours.", schema: arrayOf(dtoRef("IceCreamFlavorResponseDto")) },
          ...commonResponses,
        },
      },
    },
    filter: {
      method: "POST",
      path: "/ice-creams/queries",
      handler: (request: any) => handleFilter(request),
      apiDoc: {
        summary: "Filter",
        description: "Filters ice creams using the shared filter contract.",
        tags: tag,
        requestBody: { required: true, schema: dtoRef("FilterRequestDto") },
        responses: {
          "200": { description: "Filtered ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    search: {
      method: "GET",
      path: "/ice-creams/search-results",
      handler: (request: any) => handleSearch(request),
      apiDoc: {
        summary: "Search",
        description: "Searches code, name, flavour and supplier.",
        tags: tag,
        requestQuerystringParams: {
          q: { description: "Search text.", schema: { type: "string" } },
        },
        responses: {
          "200": { description: "Matching ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          "400": { description: "Search text was not supplied.", schema: dtoRef("InputValidationErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/ice-creams/selections",
      handler: (request: any) => handleBatchGet(request),
      apiDoc: {
        summary: "Batch Get",
        description: "Gets ice creams by business code.",
        tags: tag,
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": { description: "Requested ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchCreate: {
      method: "POST",
      path: "/ice-creams/batches",
      handler: (request: any) => handleBatchCreate(request),
      apiDoc: {
        summary: "Batch Create",
        description: "Creates ice creams atomically with one audit mutation.",
        tags: tag,
        requestBody: { required: true, schema: arrayOf(dtoRef("IceCreamCreateRequestDto")) },
        responses: {
          "201": { description: "Created ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "A selected flavour was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "One or more codes already exist.", schema: dtoRef("ConflictErrorResponseDto") },
          "422": { description: "A selected flavour is inactive.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/ice-creams/batches",
      handler: (request: any) => handleBatchUpdate(request),
      apiDoc: {
        summary: "Batch Update",
        description: "Fully updates ice creams atomically.",
        tags: tag,
        requestBody: { required: true, schema: arrayOf(dtoRef("IceCreamBatchUpdateRequestDto")) },
        responses: {
          "200": { description: "Updated ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "An ice cream or flavour was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "A selected flavour is inactive.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchPatch: {
      method: "PATCH",
      path: "/ice-creams/batches",
      handler: (request: any) => handleBatchPatch(request),
      apiDoc: {
        summary: "Batch Patch",
        description: "Partially updates ice creams atomically.",
        tags: tag,
        requestBody: { required: true, schema: arrayOf(dtoRef("IceCreamBatchPatchRequestDto")) },
        responses: {
          "200": { description: "Patched ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "An ice cream or flavour was not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "A selected flavour is inactive.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchDelete: {
      method: "DELETE",
      path: "/ice-creams/batches",
      handler: (request: any) => handleBatchDelete(request),
      apiDoc: {
        summary: "Batch Delete",
        description: "Deletes ice creams atomically after stamping deletion audit metadata.",
        tags: tag,
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "204": { description: "Ice creams deleted." },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more ice creams were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "Deletion is blocked.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchActivate: {
      method: "PUT",
      path: "/ice-creams/batches/activation",
      handler: (request: any) => handleBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Activates ice creams atomically.",
        tags: tag,
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": { description: "Activated ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more ice creams were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "A transition is blocked.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    batchDeactivate: {
      method: "DELETE",
      path: "/ice-creams/batches/activation",
      handler: (request: any) => handleBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Deactivates ice creams atomically.",
        tags: tag,
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": { description: "Deactivated ice creams.", schema: arrayOf(dtoRef("IceCreamResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "One or more ice creams were not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "A transition is blocked.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    get: {
      method: "GET",
      path: "/ice-creams/[code]",
      handler: (request: any, context: any) => handleGet(request, context),
      apiDoc: {
        summary: "Get",
        description: "Gets an ice cream by business code.",
        tags: tag,
        requestPathParams: codePathParameter,
        responses: {
          "200": { description: "The requested ice cream.", schema: dtoRef("IceCreamResponseDto") },
          "404": { description: "Ice cream not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    update: {
      method: "PUT",
      path: "/ice-creams/[code]",
      handler: (request: any, context: any) => handleUpdate(request, context),
      apiDoc: {
        summary: "Update",
        description: "Fully updates the writable fields of an ice cream.",
        tags: tag,
        requestPathParams: codePathParameter,
        requestBody: { required: true, schema: dtoRef("IceCreamUpdateRequestDto") },
        responses: {
          "200": { description: "Updated ice cream.", schema: dtoRef("IceCreamResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Ice cream or flavour not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "The selected flavour is inactive.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/ice-creams/[code]",
      handler: (request: any, context: any) => handlePatch(request, context),
      apiDoc: {
        summary: "Patch",
        description: "Partially updates the writable fields of an ice cream.",
        tags: tag,
        requestPathParams: codePathParameter,
        requestBody: { required: true, schema: dtoRef("IceCreamPatchRequestDto") },
        responses: {
          "200": { description: "Patched ice cream.", schema: dtoRef("IceCreamResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Ice cream or flavour not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "The selected flavour is inactive.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/ice-creams/[code]",
      handler: (request: any, context: any) => handleDelete(request, context),
      apiDoc: {
        summary: "Delete",
        description: "Deletes an ice cream after stamping deletion audit metadata.",
        tags: tag,
        requestPathParams: codePathParameter,
        responses: {
          "204": { description: "Ice cream deleted." },
          "404": { description: "Ice cream not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "Deletion is blocked.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    activate: {
      method: "PUT",
      path: "/ice-creams/[code]/activation",
      handler: (request: any, context: any) => handleActivate(request, context),
      apiDoc: {
        summary: "Activate",
        description: "Activates an ice cream.",
        tags: tag,
        requestPathParams: codePathParameter,
        responses: {
          "200": { description: "Activated ice cream.", schema: dtoRef("IceCreamResponseDto") },
          "404": { description: "Ice cream not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "The ice cream is already active.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
    deactivate: {
      method: "DELETE",
      path: "/ice-creams/[code]/activation",
      handler: (request: any, context: any) => handleDeactivate(request, context),
      apiDoc: {
        summary: "Deactivate",
        description: "Deactivates an ice cream.",
        tags: tag,
        requestPathParams: codePathParameter,
        responses: {
          "200": { description: "Deactivated ice cream.", schema: dtoRef("IceCreamResponseDto") },
          "404": { description: "Ice cream not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "422": { description: "The ice cream is already inactive.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          ...commonResponses,
        },
      },
    },
  },
} as const satisfies VoyzuPackageModuleDefinition;

export default iceCreamsModule;
