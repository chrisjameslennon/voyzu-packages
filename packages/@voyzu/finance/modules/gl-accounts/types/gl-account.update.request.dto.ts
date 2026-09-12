import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "../../common/types/index";
import { BusinessCode14, NonBlankText, PositiveId } from "../../common/types/constraints";

export const GlAccountUpdateRequestDto = StrictObject({
  code: BusinessCode14,
  name: NonBlankText,
  accountType: AccountType,
  accountCategoryId: Type.Optional(PositiveId),
});
export type GlAccountUpdateRequestDto = Type.Static<typeof GlAccountUpdateRequestDto>;
