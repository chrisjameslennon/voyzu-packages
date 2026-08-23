import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { NonBlankText, NormalizableBusinessCode } from "@voyzu/finance/types/constraints";

const NullablePostingCode = Type.Union([NormalizableBusinessCode, Type.Literal(""), Type.Null()]);

export const ItemPostingProfileCreateRequestDto = StrictObject({
  profile_code: NormalizableBusinessCode,
  profile_name: NonBlankText,
  description: NonBlankText,
  is_sold: Type.Boolean(),
  is_purchased: Type.Boolean(),
  is_consumed: Type.Boolean(),
  revenue_code: NullablePostingCode,
  cogs_code: NullablePostingCode,
  purchase_expense_code: NullablePostingCode,
  consumption_code: NullablePostingCode,
  adjustment_gain_code: NullablePostingCode,
  adjustment_loss_code: NullablePostingCode,
});
export type ItemPostingProfileCreateRequestDto = Type.Static<typeof ItemPostingProfileCreateRequestDto>;
