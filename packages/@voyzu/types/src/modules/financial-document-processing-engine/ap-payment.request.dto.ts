import type { BankCashDetailsRequestDto } from "./bank-cash-details.dto";
import type { ApBillCounterpartyInputDto } from "./ap-bill.request.dto";

export interface ApPaymentAllocationRequestDto {
  document_id?: string | null;
  amount: number | string;
}

export interface ApPaymentRequestDto {
  document_type?: "AP_PAYMENT";
  company_code?: string | null;
  ap_counterparty_code?: string | null;
  ap_counterparty?: ApBillCounterpartyInputDto | null;
  document_id?: string | null;
  memo?: string | null;
  payment_date: string;
  posting_date?: string | null;
  payment_amount?: number | string | null;
  bank_cash_account_code?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
  allocations?: ApPaymentAllocationRequestDto[] | null;
}
