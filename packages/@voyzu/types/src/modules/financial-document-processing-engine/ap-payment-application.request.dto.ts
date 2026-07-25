export interface ApPaymentApplicationRequestDto {
  document_type?: "AP_PAYMENT_APPLICATION";
  company_code?: string | null;
  ap_counterparty_code?: string | null;
  document_id?: string | null;
  memo?: string | null;
  application_date: string;
  posting_date?: string | null;
  applications: Array<{
    source_payment?: { document_id?: string | null } | null;
    target_bill?: { document_id?: string | null } | null;
    amount: number | string;
  }>;
}
