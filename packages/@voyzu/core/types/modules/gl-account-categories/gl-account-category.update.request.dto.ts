import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "@voyzu/core/types/modules/core";
import { NonBlankText, PositiveId } from "@voyzu/core/types/constraints";

export const GlAccountCategoryUpdateRequestDto = StrictObject({
  name: NonBlankText,
  accountType: AccountType,
  sequence: PositiveId,
});
export type GlAccountCategoryUpdateRequestDto = Type.Static<typeof GlAccountCategoryUpdateRequestDto>;
