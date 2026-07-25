import type { BankCashDetailsRequestDto } from "./bank-cash-details.dto";

export interface ArRefundRequestDto {
  document_type?: "AR_REFUND";
  company_code?: string | null;
  ar_counterparty_code?: string | null;
  document_id?: string | null;
  memo?: string | null;
  refund_date: string;
  posting_date?: string | null;
  refund_amount: number | string;
  bank_cash_account_code?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
  dimensions?: Record<string, string> | null;
}
