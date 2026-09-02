import Type, { type Static } from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto, Status } from "@voyzu/types/modules/core";

const Id = Type.Integer({ minimum: 1 });
const Text = Type.String({ pattern: "\\S" });
export const ConfigurationKindDto = Type.Union([
  Type.Literal("category"),
  Type.Literal("warehouse"),
  Type.Literal("custom-field"),
  Type.Literal("option-list"),
]);
export type ConfigurationKind = Static<typeof ConfigurationKindDto>;
export const ConfigurationRowDto = StrictObject({
  id: Id,
  code: Type.Union([Type.String(), Type.Null()]),
  name: Text,
  description: Type.String(),
  secondary: Type.String(),
  dataType: Type.Union([Type.String(), Type.Null()]),
  appliesTo: Type.Union([Type.String(), Type.Null()]),
  count: Type.Integer({ minimum: 0 }),
  unitsOnHand: Type.Number(),
  hasUnitsOnHand: Type.Boolean(),
  status: Status,
});
export type ConfigurationRow = Static<typeof ConfigurationRowDto>;
export const ConfigurationDetailDto = StrictObject({
  id: Id,
  code: Type.Union([Type.String(), Type.Null()]),
  name: Text,
  description: Type.String(),
  status: Status,
  inUse: Type.Boolean(),
  addressLine1: Type.String(),
  addressLine2: Type.String(),
  city: Type.String(),
  region: Type.String(),
  postcode: Type.String(),
  countryCode: Type.Union([Type.String(), Type.Null()]),
  dataType: Type.Union([Type.String(), Type.Null()]),
  appliesTo: Type.Union([Type.String(), Type.Null()]),
  required: Type.Boolean(),
  showInFilter: Type.Boolean(),
  optionListId: Type.Union([Id, Type.Null()]),
  isShared: Type.Boolean(),
  options: Type.Array(
    StrictObject({
      id: Id,
      value: Text,
      status: Status,
      usedBy: Type.Integer({ minimum: 0 }),
    }),
  ),
  usedBy: Type.Array(
    StrictObject({ id: Id, name: Text, appliesTo: Text, dataType: Text }),
  ),
  audit: AuditMetadataDto,
});
export type ConfigurationDetail = Static<typeof ConfigurationDetailDto>;
export const ConfigurationCreateDto = StrictObject({
  code: Type.Optional(Text),
  name: Text,
  description: Type.Optional(Type.String()),
  addressLine1: Type.Optional(Type.String()),
  addressLine2: Type.Optional(Type.String()),
  city: Type.Optional(Type.String()),
  region: Type.Optional(Type.String()),
  postcode: Type.Optional(Type.String()),
  countryCode: Type.Optional(
    Type.Union([Type.String({ pattern: "^[A-Z]{2}$" }), Type.Null()]),
  ),
  dataType: Type.Optional(Type.String()),
  appliesTo: Type.Optional(Type.String()),
  required: Type.Optional(Type.Boolean()),
  showInFilter: Type.Optional(Type.Boolean()),
  optionListId: Type.Optional(Type.Union([Id, Type.Null()])),
  isShared: Type.Optional(Type.Boolean()),
});
export type ConfigurationCreate = Static<typeof ConfigurationCreateDto>;
export const ConfigurationPatchDto = Type.Partial(ConfigurationCreateDto);
export type ConfigurationPatch = Static<typeof ConfigurationPatchDto>;
export const OptionValueCreateDto = StrictObject({ value: Text });
export type OptionValueCreate = Static<typeof OptionValueCreateDto>;
export const OptionValuePatchDto = StrictObject({
  value: Type.Optional(Text),
  status: Type.Optional(Status),
});
export type OptionValuePatch = Static<typeof OptionValuePatchDto>;
