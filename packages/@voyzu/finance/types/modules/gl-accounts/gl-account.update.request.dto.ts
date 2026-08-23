import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "@voyzu/finance/types/modules/core";
import { BusinessCode14, NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const GlAccountUpdateRequestDto = StrictObject({
  code: BusinessCode14,
  name: NonBlankText,
  accountType: AccountType,
  accountCategoryId: Type.Optional(PositiveId),
});
export type GlAccountUpdateRequestDto = Type.Static<typeof GlAccountUpdateRequestDto>;
