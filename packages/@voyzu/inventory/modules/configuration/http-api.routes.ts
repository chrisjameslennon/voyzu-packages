import Type from "typebox";
import {
  BusinessRuleErrorResponseDto,
  ConflictErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
  InputValidationErrorResponseDto,
} from "@voyzu/types";
import {
  ConfigurationCreateDto,
  ConfigurationDetailDto,
  ConfigurationPatchDto,
  ConfigurationRowDto,
  OptionValueCreateDto,
  OptionValuePatchDto,
} from "./types/configuration.types";
const load = () => import("./server/http-api/configuration.http.handlers");
const errors = {
  "400": {
    description: "Validation failed",
    body: InputValidationErrorResponseDto,
  },
  "404": { description: "Not found", body: EntityNotFoundErrorResponseDto },
  "409": { description: "Conflict", body: ConflictErrorResponseDto },
  "422": {
    description: "Business rule blocked the operation",
    body: BusinessRuleErrorResponseDto,
  },
  "500": {
    description: "Unexpected error",
    body: InternalServerErrorResponseDto,
  },
} as const;
const idPath = { id: { schema: Type.String({ pattern: "^[1-9][0-9]*$" }) } };
const kindPath = {
  kind: {
    schema: Type.Union([
      Type.Literal("category"),
      Type.Literal("warehouse"),
      Type.Literal("custom-field"),
      Type.Literal("option-list"),
    ]),
  },
};
export const httpApiRoutes = {
  "inventory.configuration.list": {
    description: "Lists the selected inventory configuration record type for the active organization.",
    method: "GET",
    path: "/inventory/configuration/[kind]",
    loadHandler: () => load().then((m) => m.handleList),
    summary: "List inventory configuration",
    
    
    request: { path: kindPath },
    responses: {
      "200": {
        description: "Configuration records",
        body: Type.Array(ConfigurationRowDto),
      },
      ...errors,
    },
  },
  "inventory.configuration.create": {
    description: "Creates a category, warehouse, custom field, or option list in the active organization.",
    method: "POST",
    path: "/inventory/configuration/[kind]",
    loadHandler: () => load().then((m) => m.handleCreate),
    summary: "Create inventory configuration",
    
    
    request: {
      path: kindPath,
      contentType: "application/json",
      body: ConfigurationCreateDto,
    },
    responses: {
      "201": { description: "Created record", body: ConfigurationDetailDto },
      ...errors,
    },
  },
  "inventory.configuration.get": {
    description: "Gets one inventory configuration record including audit and usage information.",
    method: "GET",
    path: "/inventory/configuration/[kind]/[id]",
    loadHandler: () => load().then((m) => m.handleGet),
    summary: "Get inventory configuration",
    
    
    request: { path: { ...kindPath, ...idPath } },
    responses: {
      "200": {
        description: "Configuration record",
        body: ConfigurationDetailDto,
      },
      ...errors,
    },
  },
  "inventory.configuration.patch": {
    description: "Updates writable details on an inventory configuration record.",
    method: "PATCH",
    path: "/inventory/configuration/[kind]/[id]",
    loadHandler: () => load().then((m) => m.handlePatch),
    summary: "Update inventory configuration",
    
    
    request: {
      path: { ...kindPath, ...idPath },
      contentType: "application/json",
      body: ConfigurationPatchDto,
    },
    responses: {
      "200": { description: "Updated record", body: ConfigurationDetailDto },
      ...errors,
    },
  },
  "inventory.configuration.transition": {
    description: "Activates, deactivates, or deletes selected inventory configuration records. Item categories containing items cannot be deactivated or deleted, and warehouses holding stock cannot be deleted.",
    method: "POST",
    path: "/inventory/configuration/[kind]/transition",
    loadHandler: () => load().then((m) => m.handleTransition),
    summary: "Change inventory configuration status",
    
    
    request: {
      path: kindPath,
      contentType: "application/json",
      body: Type.Object({
        ids: Type.Array(Type.Integer({ minimum: 1 }), { minItems: 1 }),
        status: Type.Union([
          Type.Literal("ACTIVE"),
          Type.Literal("INACTIVE"),
          Type.Literal("DELETED"),
        ]),
      }),
    },
    responses: {
      "200": {
        description: "Changed records",
        body: Type.Array(ConfigurationDetailDto),
      },
      ...errors,
    },
  },
  "inventory.configuration.addOption": {
    description: "Adds a value to an inventory custom-field option list.",
    method: "POST",
    path: "/inventory/configuration/option-list/[id]/options",
    loadHandler: () => load().then((m) => m.handleAddOption),
    summary: "Add option list value",
    
    
    request: {
      path: idPath,
      contentType: "application/json",
      body: OptionValueCreateDto,
    },
    responses: {
      "200": {
        description: "Updated option list",
        body: ConfigurationDetailDto,
      },
      ...errors,
    },
  },
  "inventory.configuration.patchOption": {
    description: "Renames, activates, or deactivates an option-list value.",
    method: "PATCH",
    path: "/inventory/configuration/option-list/[id]/options/[optionId]",
    loadHandler: () => load().then((m) => m.handlePatchOption),
    summary: "Update option list value",
    
    
    request: {
      path: {
        ...idPath,
        optionId: { schema: Type.String({ pattern: "^[1-9][0-9]*$" }) },
      },
      contentType: "application/json",
      body: OptionValuePatchDto,
    },
    responses: {
      "200": {
        description: "Updated option list",
        body: ConfigurationDetailDto,
      },
      ...errors,
    },
  },
  "inventory.configuration.deleteOption": {
    description: "Deletes an option-list value and permanently removes values that reference it.",
    method: "DELETE",
    path: "/inventory/configuration/option-list/[id]/options/[optionId]",
    loadHandler: () => load().then((m) => m.handleDeleteOption),
    summary: "Delete option list value and its usages",
    
    
    request: {
      path: {
        ...idPath,
        optionId: { schema: Type.String({ pattern: "^[1-9][0-9]*$" }) },
      },
    },
    responses: {
      "200": {
        description: "Updated option list",
        body: ConfigurationDetailDto,
      },
      ...errors,
    },
  },
} as const;
