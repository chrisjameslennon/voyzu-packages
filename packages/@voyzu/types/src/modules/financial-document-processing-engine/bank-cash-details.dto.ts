export interface BankCashDetailsRequestDto {
  code: string;
  tx_id?: string | null;
  tx_code?: string | null;
  tx_ref?: string | null;
  tx_details?: string | null;
  payment_ref?: string | null;
}

export interface BankCashJournalDetailsDto extends BankCashDetailsRequestDto {
  id: number;
  type: "BANK" | "CASH" | "OTHER";
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  bank_name?: string | null;
  bank_branch_name?: string | null;
  bank_account_identifier?: string | null;
  cash_account_identifier?: string | null;
}
