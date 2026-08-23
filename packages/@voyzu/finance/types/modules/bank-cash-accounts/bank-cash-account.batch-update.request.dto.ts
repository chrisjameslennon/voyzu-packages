import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";
import { BankCashAccountUpdateRequestDto } from "./bank-cash-account.update.request.dto";
import { BusinessCode40, TrimmedText100, TrimmedText50 } from "@voyzu/finance/types/constraints";

export const BankCashAccountBatchUpdateRequestDto = StrictObject({
  ...BankCashAccountUpdateRequestDto.properties,
  code: BusinessCode40,
});
export type BankCashAccountBatchUpdateRequestDto = Type.Static<typeof BankCashAccountBatchUpdateRequestDto>;
