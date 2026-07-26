import type { BankCashAccountPatchRequestDto } from "./bank-cash-account.patch.request.dto";

export interface BankCashAccountBatchPatchRequestDto extends BankCashAccountPatchRequestDto {
  code: string;
}
