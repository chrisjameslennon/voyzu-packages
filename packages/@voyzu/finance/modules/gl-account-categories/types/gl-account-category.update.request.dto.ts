import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "../../common/types/index";
import { NonBlankText, PositiveId } from "../../common/types/constraints";

export const GlAccountCategoryUpdateRequestDto = StrictObject({
  name: NonBlankText,
  accountType: AccountType,
  sequence: PositiveId,
});
export type GlAccountCategoryUpdateRequestDto = Type.Static<typeof GlAccountCategoryUpdateRequestDto>;
