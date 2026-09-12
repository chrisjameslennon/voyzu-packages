import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "../../common/types/index";
import { BusinessCode14, NonBlankText, PositiveId } from "../../common/types/constraints";

export const GlAccountCreateRequestDto = StrictObject({
  code: BusinessCode14,
  name: NonBlankText,
  accountType: AccountType,
  accountCategoryId: PositiveId,
});
export type GlAccountCreateRequestDto = Type.Static<typeof GlAccountCreateRequestDto>;
