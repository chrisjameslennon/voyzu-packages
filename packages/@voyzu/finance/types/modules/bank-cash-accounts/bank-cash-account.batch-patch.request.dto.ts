import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BankCashAccountPatchRequestDto } from "./bank-cash-account.patch.request.dto";
import { BusinessCode40, TrimmedText100, TrimmedText50 } from "@voyzu/finance/types/constraints";

export const BankCashAccountBatchPatchRequestDto = StrictObject({
  ...BankCashAccountPatchRequestDto.properties,
  code: BusinessCode40,
});
export type BankCashAccountBatchPatchRequestDto = Type.Static<typeof BankCashAccountBatchPatchRequestDto>;
