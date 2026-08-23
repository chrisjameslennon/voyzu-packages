import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { AccountType } from "@voyzu/finance/types/modules/core";
import { NonBlankText, PositiveId } from "@voyzu/finance/types/constraints";

export const GlAccountCategoryPatchRequestDto = StrictObject({
  name: Type.Optional(NonBlankText),
  accountType: Type.Optional(AccountType),
  sequence: Type.Optional(PositiveId),
}, { minProperties: 1 });
export type GlAccountCategoryPatchRequestDto = Type.Static<typeof GlAccountCategoryPatchRequestDto>;
