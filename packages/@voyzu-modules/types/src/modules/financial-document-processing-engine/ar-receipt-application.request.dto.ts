export interface ArDocumentReferenceRequestDto {
  document_id?: string | null;
}

export interface ArReceiptApplicationLineRequestDto {
  source_receipt?: ArDocumentReferenceRequestDto | null;
  target_invoice?: ArDocumentReferenceRequestDto | null;
  amount: number | string;
}

export interface ArReceiptApplicationRequestDto {
  document_type: "AR_RECEIPT_APPLICATION";
  company_code?: string | null;
  ar_counterparty_code?: string | null;
  document_id?: string | null;
  document_memo?: string | null;
  application_date: string;
  posting_date?: string | null;
  applications: ArReceiptApplicationLineRequestDto[];
}
