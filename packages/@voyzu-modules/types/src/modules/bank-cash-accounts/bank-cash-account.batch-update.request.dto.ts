import type { BankCashAccountUpdateRequestDto } from "./bank-cash-account.update.request.dto";

export interface BankCashAccountBatchUpdateRequestDto extends BankCashAccountUpdateRequestDto {
  code: string;
}
