import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { NonBlankText, NormalizableBusinessCode } from "@voyzu/core/types/constraints";

export const InventoryCategoryCreateRequestDto = StrictObject({
  code: NormalizableBusinessCode,
  name: NonBlankText,
  description: NonBlankText,
  posting_profile_code: NormalizableBusinessCode,
});
export type InventoryCategoryCreateRequestDto = Type.Static<typeof InventoryCategoryCreateRequestDto>;
