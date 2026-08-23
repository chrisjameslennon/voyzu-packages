import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { InventoryItemType } from "./inventory-item.response.dto";
import { NonBlankText, NormalizableBusinessCode, NormalizableUnitCode } from "@voyzu/finance/types/constraints";

const NullableNumber = Type.Union([Type.Number(), Type.Null()]);

export const InventoryItemCreateRequestDto = StrictObject({
  item_code: NormalizableBusinessCode,
  item_name: NonBlankText,
  description: NonBlankText,
  item_type: InventoryItemType,
  category_code: NormalizableBusinessCode,
  unit_code: NormalizableUnitCode,
  quantity_on_hand_derived: NullableNumber,
  book_value_derived: NullableNumber,
  avg_unit_book_value_derived: NullableNumber,
});
export type InventoryItemCreateRequestDto = Type.Static<typeof InventoryItemCreateRequestDto>;
