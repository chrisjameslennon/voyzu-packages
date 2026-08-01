import type { DrCr, EntryType } from "@voyzu/core/types/modules/core";
import type { BankCashJournalDetailsDto } from "./bank-cash-details.dto";
import type { TaxAdjustmentEffect, TaxMovementCode, TaxProcessingDocumentType } from "./tax-processing.request.dto";

export interface TaxProcessingJournalLineDto {
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
  memo: string | null;
}

export interface TaxProcessingTaxLedgerDetailDto {
  id: number | null;
  code: string | null;
  tax_rule: "CALLER_SUPPLIED";
  tax_component_id: number | null;
  tax_authority_code: string;
  tax_authority_name?: string;
  tax_movement_type_code: TaxMovementCode;
  description: string;
  tax_rate: number;
  taxable_amount: number;
  posting_date: string;
  financial_year_code: string;
  financial_period_code: string;
  base_currency_code: string;
  entry_type: EntryType;
  base_currency_amount: number;
  status: "POSTED" | "EPHEMERAL";
}

export interface TaxProcessingDetailedDocumentDto {
  document_type: TaxProcessingDocumentType;
  company: { code: string; base_currency_code: string };
  tax_authority: { code: string; name: string };
  document_id: string;
  memo: string | null;
  generated_description: string;
  posting_date: string;
  tax_movement_code: TaxMovementCode;
  bank_cash_account_code?: string | null;
  bank_cash_details?: BankCashJournalDetailsDto | null;
  payment_date?: string;
  payment_amount?: number;
  refund_date?: string;
  refund_amount?: number;
  adjustment_date?: string;
  adjustment_effect?: TaxAdjustmentEffect;
  adjustment_gl_account_code?: string | null;
  adjustment_amount?: number;
}

export interface TaxProcessingPostingResponseDto {
  detailed_document: TaxProcessingDetailedDocumentDto;
  tax_ledger_details: TaxProcessingTaxLedgerDetailDto[];
  posting_details: {
    journal_header: {
      id: number | null;
      code: string | null;
      document_type_code: TaxProcessingDocumentType;
      document_id: string;
      generated_description: string;
      posting_engine_code: TaxProcessingDocumentType;
      company_code: string;
      document_date: string;
      posting_date: string;
      financial_year_code: string;
      financial_period_code: string;
      base_currency_code: string;
      total_debit_base_amount: number;
      total_credit_base_amount: number;
      memo: string | null;
      status: "POSTED" | "EPHEMERAL";
    };
    journal_lines: TaxProcessingJournalLineDto[];
  };
}
