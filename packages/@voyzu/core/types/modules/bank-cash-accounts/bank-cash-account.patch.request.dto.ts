import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BankCashAccountType } from "./bank-cash-account.response.dto";
import { BusinessCode40, NonBlankText, PositiveId, TrimmedText100, TrimmedText50 } from "@voyzu/core/types/constraints";

export const BankCashAccountPatchRequestDto = StrictObject({
  code: Type.Optional(BusinessCode40),
  type: Type.Optional(BankCashAccountType),
  glAccountId: Type.Optional(PositiveId),
  bankName: Type.Optional(Type.Union([TrimmedText50, Type.Null()])),
  bankBranchName: Type.Optional(Type.Union([TrimmedText50, Type.Null()])),
  bankAccountIdentifier: Type.Optional(Type.Union([TrimmedText100, Type.Null()])),
  cashAccountIdentifier: Type.Optional(Type.Union([TrimmedText100, Type.Null()])),
}, { minProperties: 1 });
export type BankCashAccountPatchRequestDto = Type.Static<typeof BankCashAccountPatchRequestDto>;
