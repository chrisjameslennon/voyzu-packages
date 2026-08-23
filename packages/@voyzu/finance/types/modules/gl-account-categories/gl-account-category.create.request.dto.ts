import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "@voyzu/finance/types/modules/core";
import { BusinessCode, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const GlAccountCategoryCreateRequestDto = StrictObject({
  code: BusinessCode,
  name: NonBlankText,
  accountType: AccountType,
  sequence: PositiveId,
});
export type GlAccountCategoryCreateRequestDto = Type.Static<typeof GlAccountCategoryCreateRequestDto>;
