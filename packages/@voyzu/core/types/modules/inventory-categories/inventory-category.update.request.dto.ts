import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { NonBlankText, NormalizableBusinessCode } from "@voyzu/core/types/constraints";

export const InventoryCategoryUpdateRequestDto = StrictObject({
  name: NonBlankText,
  description: NonBlankText,
  posting_profile_code: NormalizableBusinessCode,
});
export type InventoryCategoryUpdateRequestDto = Type.Static<typeof InventoryCategoryUpdateRequestDto>;
