export interface ApBillCancellationRequestDto {
  document_type?: "AP_BILL_CANCELLATION";
  company_code?: string | null;
  ap_counterparty_code?: string | null;
  document_id?: string | null;
  memo?: string | null;
  source_bill?: { document_id?: string | null } | null;
  cancellation_date: string;
  posting_date?: string | null;
}
