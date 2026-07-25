import type { BankCashJournalDetailsDto } from "./bank-cash-details.dto";
import type {
  LedgerJournalJournalLineDto,
  LedgerJournalPostingDetailsDto,
} from "./ledger-journal.response.dto";

export interface LedgerJournalReversalDetailedDocumentDto {
  company: {
    code: string;
    base_currency_code: string;
  };
  document_id: string;
  document_memo: string | null;
  bank_cash_details?: BankCashJournalDetailsDto | null;
  generated_description: string;
  source_journal_code: string;
  source_document_id: string;
  posting_date: string;
  lines: LedgerJournalJournalLineDto[];
  total_debit_base_amount: number;
  total_credit_base_amount: number;
}

export interface LedgerJournalReversalPostingResponseDto {
  detailed_document: LedgerJournalReversalDetailedDocumentDto;
  posting_details: LedgerJournalPostingDetailsDto;
}
