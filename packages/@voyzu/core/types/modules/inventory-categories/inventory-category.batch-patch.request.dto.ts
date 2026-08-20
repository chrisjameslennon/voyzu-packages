import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { InventoryCategoryPatchRequestDto } from "./inventory-category.patch.request.dto";
import { BusinessCode } from "@voyzu/core/types/constraints";

export const InventoryCategoryBatchPatchRequestDto = StrictObject({
  ...InventoryCategoryPatchRequestDto.properties,
  code: BusinessCode,
});
export type InventoryCategoryBatchPatchRequestDto = Type.Static<typeof InventoryCategoryBatchPatchRequestDto>;
