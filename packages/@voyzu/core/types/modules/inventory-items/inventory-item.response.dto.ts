import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AuditMetadataDto } from "@voyzu/core/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const InventoryItemType = Type.Union([
  Type.Literal("INVENTORY"),
  Type.Literal("NON_INVENTORY"),
  Type.Literal("SERVICE"),
]);

export const InventoryItemResponseDto = StrictObject({
  id: PositiveId,
  item_code: BusinessCode,
  item_name: NonBlankText,
  description: Type.String(),
  item_type: InventoryItemType,
  category_code: BusinessCode,
  unit_code: BusinessCode,
  status: Type.Union([Type.Literal("ACTIVE"), Type.Literal("INACTIVE")]),
  hasPostings: Type.Boolean(),
  quantity_on_hand_derived: Type.Union([Type.Number(), Type.Null()]),
  book_value_derived: Type.Union([Type.Number(), Type.Null()]),
  avg_unit_book_value_derived: Type.Union([Type.Number(), Type.Null()]),
  audit: AuditMetadataDto,
});
export type InventoryItemResponseDto = Type.Static<typeof InventoryItemResponseDto>;
