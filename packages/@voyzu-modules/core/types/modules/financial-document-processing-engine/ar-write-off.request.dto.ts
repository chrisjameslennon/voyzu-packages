export interface ArWriteOffTargetInvoiceRequestDto {
  document_id?: string | null;
}

export interface ArWriteOffApplicationRequestDto {
  target_invoice?: ArWriteOffTargetInvoiceRequestDto | null;
  amount: number | string;
}

export interface ArWriteOffRequestDto {
  document_type?: "AR_WRITE_OFF";
  company_code?: string | null;
  ar_counterparty_code?: string | null;
  document_id?: string | null;
  memo?: string | null;
  write_off_date: string;
  posting_date?: string | null;
  write_off_expense_posting_code?: string | null;
  applications: ArWriteOffApplicationRequestDto[];
  dimensions?: Record<string, string> | null;
}
