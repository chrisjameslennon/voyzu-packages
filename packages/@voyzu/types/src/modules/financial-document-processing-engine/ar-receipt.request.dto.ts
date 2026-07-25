import type { BankCashDetailsRequestDto } from "./bank-cash-details.dto";

export interface ArReceiptCounterpartyInputDto {
  code?: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  state_or_province_code?: string | null;
}

export interface ArReceiptAllocationRequestDto {
  document_id?: string | null;
  amount: number;
}

export interface ArReceiptRequestDto {
  document_type?: "AR_RECEIPT";
  company_code?: string | null;
  ar_counterparty_code?: string | null;
  ar_counterparty?: ArReceiptCounterpartyInputDto | null;
  document_id?: string | null;
  memo?: string | null;
  payment_date: string;
  posting_date?: string | null;
  receipt_amount?: number | null;
  bank_cash_account_code?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
  allocations?: ArReceiptAllocationRequestDto[] | null;
}
