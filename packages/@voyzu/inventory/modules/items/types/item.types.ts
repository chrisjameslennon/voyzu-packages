import Type, { type Static } from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto, Status } from "@voyzu/types/modules/core";
import { Unit } from "../../core/types";

const PositiveId = Type.Integer({ minimum: 1 });
const ItemSku = Type.String({ pattern: "^[A-Z0-9][A-Z0-9_-]*$" });
const NonBlankText = Type.String({ pattern: "\\S" });

export const ItemTypeDto = Type.Union([Type.Literal("SINGLE_ITEM"), Type.Literal("ASSEMBLY")]);
export const ItemCategoryOptionDto = StrictObject({ id: PositiveId, code: Type.String(), name: NonBlankText });
export type ItemCategoryOptionDto = Static<typeof ItemCategoryOptionDto>;
export const ItemComponentDto = StrictObject({ itemId: PositiveId, sku: ItemSku, name: NonBlankText, quantity: Type.Number({ exclusiveMinimum: 0 }), unit: Type.Union([Unit, Type.Null()]) });
export type ItemComponentDto = Static<typeof ItemComponentDto>;
export const ItemComponentInputDto = StrictObject({ itemId: PositiveId, quantity: Type.Number({ exclusiveMinimum: 0 }) });
export type ItemComponentInputDto = Static<typeof ItemComponentInputDto>;
export const ItemCustomFieldValueDto = Type.Union([Type.String(), Type.Number(), Type.Boolean(), Type.Array(PositiveId), Type.Null()]);
export const ItemCustomFieldDto = StrictObject({
  id: PositiveId, name: NonBlankText,
  dataType: Type.Union([Type.Literal("TEXT"), Type.Literal("NUMBER"), Type.Literal("DATE"), Type.Literal("BOOLEAN"), Type.Literal("OPTION"), Type.Literal("MULTIPLE_OPTIONS")]),
  required: Type.Boolean(), status: Status,
  options: Type.Array(StrictObject({ id: PositiveId, value: NonBlankText })), value: ItemCustomFieldValueDto,
});
export type ItemCustomFieldDto = Static<typeof ItemCustomFieldDto>;
export const ItemCustomFieldInputDto = StrictObject({ customFieldId: PositiveId, value: ItemCustomFieldValueDto });
export type ItemCustomFieldInputDto = Static<typeof ItemCustomFieldInputDto>;
export const ItemCreateRequestDto = StrictObject({
  sku: Type.Optional(ItemSku), name: NonBlankText, unit: Type.Union([Unit, Type.Null()]),
  categoryId: PositiveId, quantityTracked: Type.Boolean(), itemPostingCodeId: Type.Union([PositiveId, Type.Null()]),
});
export type ItemCreateRequestDto = Static<typeof ItemCreateRequestDto>;
export const ItemPatchRequestDto = StrictObject({
  name: Type.Optional(NonBlankText), description: Type.Optional(Type.String()),
  categoryId: Type.Optional(Type.Union([PositiveId, Type.Null()])), unit: Type.Optional(Type.Union([Unit, Type.Null()])),
  quantityTracked: Type.Optional(Type.Boolean()), itemPostingCodeId: Type.Optional(Type.Union([PositiveId, Type.Null()])),
  itemType: Type.Optional(ItemTypeDto), components: Type.Optional(Type.Array(ItemComponentInputDto)),
  customFields: Type.Optional(Type.Array(ItemCustomFieldInputDto)),
});
export type ItemPatchRequestDto = Static<typeof ItemPatchRequestDto>;
export const ItemResponseDto = StrictObject({
  id: PositiveId, sku: ItemSku, name: NonBlankText, description: Type.String(),
  category: Type.Union([ItemCategoryOptionDto, Type.Null()]), unit: Type.Union([Unit, Type.Null()]),
  itemType: ItemTypeDto, quantityTracked: Type.Boolean(), itemPostingCodeId: Type.Union([PositiveId, Type.Null()]),
  status: Status, inUse: Type.Boolean(), components: Type.Array(ItemComponentDto), customFields: Type.Array(ItemCustomFieldDto), audit: AuditMetadataDto,
});
export type ItemResponseDto = Static<typeof ItemResponseDto>;
export const ItemListRowDto = StrictObject({
  id: PositiveId, sku: ItemSku, name: NonBlankText, category: Type.Union([Type.String(), Type.Null()]),
  itemType: ItemTypeDto, unit: Type.Union([Unit, Type.Null()]), quantityTracked: Type.Boolean(),
  cost: Type.Union([Type.Number(), Type.Null()]), status: Status,
});
export type ItemListRowDto = Static<typeof ItemListRowDto>;
export const ItemCodeListRequestDto = StrictObject({ skus: Type.Array(ItemSku, { minItems: 1 }) });
export type ItemCodeListRequestDto = Static<typeof ItemCodeListRequestDto>;
export interface PostingProfileOption { id: number; code: string; name: string; status: "ACTIVE" | "INACTIVE"; }
export const ItemOptionsDto = StrictObject({ categories: Type.Array(ItemCategoryOptionDto), nextSku: ItemSku });
