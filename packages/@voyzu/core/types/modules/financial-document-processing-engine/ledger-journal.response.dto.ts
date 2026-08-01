import type { DrCr } from "@voyzu/core/types/modules/core";
import type { BankCashJournalDetailsDto } from "./bank-cash-details.dto";

export interface LedgerJournalDetailedLineDto {
  line_id: number;
  gl_account_code: string;
  gl_account_name: string;
  description: string;
  memo: string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  dimensions: Record<string, string>;
}

export interface LedgerJournalDetailedDocumentDto {
  company: {
    code: string;
    base_currency_code: string;
  };
  document_id: string;
  document_memo: string | null;
  bank_cash_details?: BankCashJournalDetailsDto | null;
  generated_description: string;
  posting_date: string;
  lines: LedgerJournalDetailedLineDto[];
  total_debit_base_amount: number;
  total_credit_base_amount: number;
}

export interface LedgerJournalLineDimensionDto {
  dimension_code: string;
  dimension_name: string;
  dimension_value_name: string;
}

export interface LedgerJournalJournalHeaderDto {
  id: number | null;
  code: string | null;
  document_type_code: "LEDGER_JOURNAL" | "LEDGER_JOURNAL_REVERSAL";
  document_id: string;
  generated_description: string;
  posting_engine_code: "LEDGER_JOURNAL" | "LEDGER_JOURNAL_REVERSAL";
  company_code: string;
  document_date: string;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  total_debit_base_amount: number;
  total_credit_base_amount: number;
  document_memo: string | null;
  status: "POSTED" | "EPHEMERAL";
}

export interface LedgerJournalJournalLineDto {
  id: number | null;
  journal_header_id: number | null;
  line_number: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: string | null;
  source_control_account: string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  document_memo: string | null;
  dimensions?: LedgerJournalLineDimensionDto[];
}

export interface LedgerJournalPostingDetailsDto {
  journal_header: LedgerJournalJournalHeaderDto;
  journal_lines: LedgerJournalJournalLineDto[];
}

export interface LedgerJournalPostingResponseDto {
  detailed_document: LedgerJournalDetailedDocumentDto;
  posting_details: LedgerJournalPostingDetailsDto;
}
