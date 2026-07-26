import type { BankCashAccountType } from "./bank-cash-account.response.dto";

export interface BankCashAccountPatchRequestDto {
  code?: string;
  type?: BankCashAccountType;
  glAccountId?: number;
  bankName?: string | null;
  bankBranchName?: string | null;
  bankAccountIdentifier?: string | null;
  cashAccountIdentifier?: string | null;
}
