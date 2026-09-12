import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "../../common/types/index";
import { BusinessCode, NonBlankText, PositiveId } from "../../common/types/constraints";

export const GlAccountCategoryCreateRequestDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
  accountType: AccountType,
  sequence: PositiveId,
});
export type GlAccountCategoryCreateRequestDto = Type.Static<typeof GlAccountCategoryCreateRequestDto>;
