import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BankCashAccountType } from "./bank-cash-account.response.dto";
import { BusinessCode40, NonBlankText, PositiveId, TrimmedText100, TrimmedText50 } from "@voyzu/core/types/constraints";

export const BankCashAccountUpdateRequestDto = StrictObject({
  code: BusinessCode40,
  type: BankCashAccountType,
  glAccountId: PositiveId,
  bankName: Type.Optional(Type.Union([TrimmedText50, Type.Null()])),
  bankBranchName: Type.Optional(Type.Union([TrimmedText50, Type.Null()])),
  bankAccountIdentifier: Type.Optional(Type.Union([TrimmedText100, Type.Null()])),
  cashAccountIdentifier: Type.Optional(Type.Union([TrimmedText100, Type.Null()])),
});
export type BankCashAccountUpdateRequestDto = Type.Static<typeof BankCashAccountUpdateRequestDto>;
