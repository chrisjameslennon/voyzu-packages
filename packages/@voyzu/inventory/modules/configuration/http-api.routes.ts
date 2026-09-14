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
