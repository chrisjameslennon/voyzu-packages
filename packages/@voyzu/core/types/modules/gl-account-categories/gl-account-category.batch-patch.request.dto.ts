import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { GlAccountCategoryPatchRequestDto } from "./gl-account-category.patch.request.dto";
import { BusinessCode } from "@voyzu/core/types/constraints";

export const GlAccountCategoryBatchPatchRequestDto = StrictObject({
  ...GlAccountCategoryPatchRequestDto.properties,
  code: BusinessCode,
});
export type GlAccountCategoryBatchPatchRequestDto = Type.Static<typeof GlAccountCategoryBatchPatchRequestDto>;
