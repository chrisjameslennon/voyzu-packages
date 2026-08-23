import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { GlAccountCategoryUpdateRequestDto } from "./gl-account-category.update.request.dto";
import { BusinessCode } from "@voyzu/finance/types/constraints";

export const GlAccountCategoryBatchUpdateRequestDto = StrictObject({
  ...GlAccountCategoryUpdateRequestDto.properties,
  code: BusinessCode,
});
export type GlAccountCategoryBatchUpdateRequestDto = Type.Static<typeof GlAccountCategoryBatchUpdateRequestDto>;
