export interface ArInvoiceCancellationSourceInvoiceRequestDto {
  document_id?: string | null;
}

export interface ArInvoiceCancellationRequestDto {
  document_type?: "AR_INVOICE_CANCELLATION";
  company_code?: string | null;
  ar_counterparty_code?: string | null;
  document_id?: string | null;
  document_memo?: string | null;
  source_invoice?: ArInvoiceCancellationSourceInvoiceRequestDto | null;
  cancellation_date: string;
  posting_date?: string | null;
}
