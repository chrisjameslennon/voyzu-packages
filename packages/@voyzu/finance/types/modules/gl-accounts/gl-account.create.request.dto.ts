import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "@voyzu/finance/types/modules/core";
import { BusinessCode14, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const GlAccountCreateRequestDto = StrictObject({
  code: BusinessCode14,
  name: NonBlankText,
  accountType: AccountType,
  accountCategoryId: PositiveId,
});
export type GlAccountCreateRequestDto = Type.Static<typeof GlAccountCreateRequestDto>;
