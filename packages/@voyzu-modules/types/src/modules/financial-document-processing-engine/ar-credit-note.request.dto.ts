import type { ArInvoiceCallerSuppliedTaxComponentDto, ArInvoiceDimensionsDto } from "./ar-invoice.request.dto";

export interface ArCreditNoteCounterpartyInputDto {
  code?: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  state_or_province_code?: string | null;
}

export interface ArCreditNoteLineRequestDto {
  line_id?: number | null;
  description: string;
  quantity?: number | null;
  net_unit_price?: number | null;
  net_line_total?: number | null;
  revenue_posting_code?: string | null;
  tax_rule: string;
  tax_components?: ArInvoiceCallerSuppliedTaxComponentDto[] | null;
  dimensions?: ArInvoiceDimensionsDto | null;
}

export interface ArCreditNoteAllocationRequestDto {
  document_id: string;
  amount: number | string;
}

export interface ArCreditNoteRequestDto {
  document_type?: "AR_CREDIT_NOTE";
  company_code?: string | null;
  ar_counterparty_code?: string | null;
  ar_counterparty?: ArCreditNoteCounterpartyInputDto | null;
  document_id?: string | null;
  memo?: string | null;
  credit_note_date: string;
  posting_date?: string | null;
  revenue_posting_code?: string | null;
  dimensions?: ArInvoiceDimensionsDto | null;
  lines: ArCreditNoteLineRequestDto[];
  allocations?: ArCreditNoteAllocationRequestDto[] | null;
}
