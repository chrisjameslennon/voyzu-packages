import type { BankCashDetailsRequestDto } from "./bank-cash-details.dto";

export interface LedgerJournalReversalRequestDto {
  document_type?: "LEDGER_JOURNAL_REVERSAL";
  company_code: string;
  document_id?: string;
  document_memo?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
  source_journal_code: string;
  posting_date?: string;
}
