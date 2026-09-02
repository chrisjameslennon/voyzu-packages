import Type, { type Static } from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto, Status } from "@voyzu/types/modules/core";
import { Unit } from "../../core/types";

const PositiveId = Type.Integer({ minimum: 1 });
const ItemSku = Type.String({ pattern: "^[A-Z0-9][A-Z0-9_-]*$" });
const NonBlankText = Type.String({ pattern: "\\S" });
const OptionalMeasurement = Type.Optional(Type.Union([Type.Number({ exclusiveMinimum: 0 }), Type.Null()]));

export const DimensionUnitDto = Type.Union([Type.Literal("mm"), Type.Literal("cm"), Type.Literal("m"), Type.Literal("in"), Type.Literal("ft")]);
export type DimensionUnit = Static<typeof DimensionUnitDto>;
export const DIMENSION_UNIT_VALUES: readonly DimensionUnit[] = ["mm", "cm", "m", "in", "ft"];
export const WeightUnitDto = Type.Union([Type.Literal("mg"), Type.Literal("g"), Type.Literal("kg"), Type.Literal("oz"), Type.Literal("lb")]);
export type WeightUnit = Static<typeof WeightUnitDto>;
export const WEIGHT_UNIT_VALUES: readonly WeightUnit[] = ["mg", "g", "kg", "oz", "lb"];

export const ItemCategoryOptionDto = StrictObject({ id: PositiveId, code: Type.String(), name: NonBlankText });
export type ItemCategoryOptionDto = Static<typeof ItemCategoryOptionDto>;
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
  categoryId: PositiveId, quantityTracked: Type.Boolean(), reservedId: Type.Optional(PositiveId),
});
export type ItemCreateRequestDto = Static<typeof ItemCreateRequestDto>;
export const ItemSkuReservationDto = StrictObject({ id: PositiveId, sku: ItemSku });
export type ItemSkuReservationDto = Static<typeof ItemSkuReservationDto>;
export const ItemPatchRequestDto = StrictObject({
  name: Type.Optional(NonBlankText), description: Type.Optional(Type.String()),
  categoryId: Type.Optional(Type.Union([PositiveId, Type.Null()])), unit: Type.Optional(Type.Union([Unit, Type.Null()])),
  quantityTracked: Type.Optional(Type.Boolean()),
  dimensionUnit: Type.Optional(Type.Union([DimensionUnitDto, Type.Null()])),
  dimensionHeight: OptionalMeasurement, dimensionWidth: OptionalMeasurement, dimensionDepth: OptionalMeasurement,
  weightUnit: Type.Optional(Type.Union([WeightUnitDto, Type.Null()])), weight: OptionalMeasurement,
  customFields: Type.Optional(Type.Array(ItemCustomFieldInputDto)),
});
export type ItemPatchRequestDto = Static<typeof ItemPatchRequestDto>;
export const ItemResponseDto = StrictObject({
  id: PositiveId, sku: ItemSku, name: NonBlankText, description: Type.String(),
  category: Type.Union([ItemCategoryOptionDto, Type.Null()]), unit: Type.Union([Unit, Type.Null()]),
  quantityTracked: Type.Boolean(),
  dimensionUnit: Type.Union([DimensionUnitDto, Type.Null()]),
  dimensionHeight: Type.Union([Type.Number(), Type.Null()]), dimensionWidth: Type.Union([Type.Number(), Type.Null()]), dimensionDepth: Type.Union([Type.Number(), Type.Null()]),
  weightUnit: Type.Union([WeightUnitDto, Type.Null()]), weight: Type.Union([Type.Number(), Type.Null()]),
  status: Status, inUse: Type.Boolean(), customFields: Type.Array(ItemCustomFieldDto), audit: AuditMetadataDto,
});
export type ItemResponseDto = Static<typeof ItemResponseDto>;
export const ItemListRowDto = StrictObject({
  id: PositiveId, sku: ItemSku, name: NonBlankText, category: Type.Union([Type.String(), Type.Null()]),
  unit: Type.Union([Unit, Type.Null()]), quantityTracked: Type.Boolean(),
  unitsOnHand: Type.Number(),
  status: Status,
});
export type ItemListRowDto = Static<typeof ItemListRowDto>;
export const ItemDeletionImpactDto = StrictObject({ itemId: PositiveId, sku: ItemSku, name: NonBlankText, unitsOnHand: Type.Number({ exclusiveMinimum: 0 }) });
export type ItemDeletionImpactDto = Static<typeof ItemDeletionImpactDto>;
export const ItemCodeListRequestDto = StrictObject({ skus: Type.Array(ItemSku, { minItems: 1 }) });
export type ItemCodeListRequestDto = Static<typeof ItemCodeListRequestDto>;
export const ItemCategoryChangeRequestDto = StrictObject({
  skus: Type.Array(ItemSku, { minItems: 1 }),
  categoryId: PositiveId,
});
export type ItemCategoryChangeRequestDto = Static<typeof ItemCategoryChangeRequestDto>;
export const ItemOptionsDto = StrictObject({ categories: Type.Array(ItemCategoryOptionDto) });
