import type { DrCr } from "@voyzu-modules/core/types/modules/core";
import type { BankCashDetailsRequestDto } from "./bank-cash-details.dto";

export interface LedgerJournalLineRequestDto {
  line_id: number;
  gl_account_code: string;
  description?: string | null;
  memo?: string | null;
  dr_cr: DrCr;
  base_currency_amount: number | string;
  dimensions?: Record<string, string> | null;
}

export interface LedgerJournalRequestDto {
  document_type?: "LEDGER_JOURNAL";
  company_code: string;
  document_id?: string;
  document_memo?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
  posting_date: string;
  lines: LedgerJournalLineRequestDto[];
}
