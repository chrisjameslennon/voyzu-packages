import type { BankCashDetailsRequestDto } from "./bank-cash-details.dto";
import type { ApBillCallerSuppliedTaxComponentDto, ApBillCounterpartyInputDto, ApBillDimensionsDto } from "./ap-bill.request.dto";

export interface ApDocumentReferenceRequestDto {
  document_id?: string | null;
}

export interface ApCreditNoteLineRequestDto {
  line_id?: number | null;
  description: string;
  net_amount?: number | string | null;
  gross_amount?: number | string | null;
  tax_rule: string;
  tax_components?: ApBillCallerSuppliedTaxComponentDto[] | null;
  tax_recoverable?: boolean | null;
  purchase_posting_code?: string | null;
  dimensions?: ApBillDimensionsDto | null;
}

export interface ApCreditNoteAllocationRequestDto {
  document_id: string;
  amount: number | string;
}

export interface ApCreditNoteRequestDto {
  document_type?: "AP_CREDIT_NOTE";
  company_code?: string | null;
  ap_counterparty_code?: string | null;
  ap_counterparty?: ApBillCounterpartyInputDto | null;
  document_id?: string | null;
  supplier_credit_note_number: string;
  memo?: string | null;
  credit_note_date: string;
  posting_date?: string | null;
  tax_recoverable?: boolean | null;
  purchase_posting_code?: string | null;
  dimensions?: ApBillDimensionsDto | null;
  lines: ApCreditNoteLineRequestDto[];
  allocations?: ApCreditNoteAllocationRequestDto[] | null;
}

export interface ApOpeningBalanceRequestDto {
  document_type?: "AP_OPENING_BALANCE";
  company_code?: string | null;
  ap_counterparty_code?: string | null;
  ap_counterparty?: ApBillCounterpartyInputDto | null;
  document_id?: string | null;
  memo?: string | null;
  opening_balance_date: string;
  posting_date?: string | null;
  opening_balance_equity_posting_code?: string | null;
  items: Array<{
    line_id?: number | null;
    external_reference?: string | null;
    description: string;
    gross_amount: number | string;
  }>;
  dimensions?: Record<string, string> | null;
}

export interface ApRefundRequestDto {
  document_type?: "AP_REFUND";
  company_code?: string | null;
  ap_counterparty_code?: string | null;
  document_id?: string | null;
  memo?: string | null;
  refund_date: string;
  posting_date?: string | null;
  refund_amount: number | string;
  bank_cash_account_code?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
  dimensions?: Record<string, string> | null;
}

export interface ApWriteOffRequestDto {
  document_type?: "AP_WRITE_OFF";
  company_code?: string | null;
  ap_counterparty_code?: string | null;
  document_id?: string | null;
  memo?: string | null;
  write_off_date: string;
  posting_date?: string | null;
  write_off_income_posting_code?: string | null;
  applications: Array<{
    target_bill?: ApDocumentReferenceRequestDto | null;
    amount: number | string;
  }>;
  dimensions?: Record<string, string> | null;
}

export type ApAdjustmentRequestDto =
  | ApCreditNoteRequestDto
  | ApOpeningBalanceRequestDto
  | ApRefundRequestDto
  | ApWriteOffRequestDto;
