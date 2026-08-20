import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { InventoryCategoryUpdateRequestDto } from "./inventory-category.update.request.dto";
import { BusinessCode } from "@voyzu/core/types/constraints";

export const InventoryCategoryBatchUpdateRequestDto = StrictObject({
  ...InventoryCategoryUpdateRequestDto.properties,
  code: BusinessCode,
});
export type InventoryCategoryBatchUpdateRequestDto = Type.Static<typeof InventoryCategoryBatchUpdateRequestDto>;
