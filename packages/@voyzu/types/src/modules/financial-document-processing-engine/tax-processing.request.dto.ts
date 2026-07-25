import type { BankCashDetailsRequestDto } from "./bank-cash-details.dto";

export type TaxProcessingDocumentType = "TAX_PAYMENT" | "TAX_REFUND" | "TAX_ADJUSTMENT";
export type TaxMovementCode = "TAX_ON_SALES" | "TAX_ON_PURCHASES";
export type TaxAdjustmentEffect =
  | "INCREASES_TAX_PAYABLE"
  | "REDUCES_TAX_PAYABLE"
  | "INCREASES_TAX_RECOVERABLE"
  | "REDUCES_TAX_RECOVERABLE";

export interface TaxPaymentRequestDto {
  document_type?: "TAX_PAYMENT";
  company_code: string;
  tax_authority_code: string;
  document_id?: string;
  memo?: string | null;
  payment_date: string;
  posting_date?: string | null;
  payment_amount: number;
  bank_cash_account_code?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
}

export interface TaxRefundRequestDto {
  document_type?: "TAX_REFUND";
  company_code: string;
  tax_authority_code: string;
  document_id?: string;
  memo?: string | null;
  refund_date: string;
  posting_date?: string | null;
  refund_amount: number;
  bank_cash_account_code?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
}

export interface TaxAdjustmentRequestDto {
  document_type?: "TAX_ADJUSTMENT";
  company_code: string;
  tax_authority_code: string;
  document_id?: string;
  memo?: string | null;
  adjustment_date: string;
  posting_date?: string | null;
  tax_movement_code: TaxMovementCode;
  adjustment_effect: TaxAdjustmentEffect;
  adjustment_amount: number;
  adjustment_gl_account_code?: string | null;
  bank_cash_details?: BankCashDetailsRequestDto | null;
}

export type TaxProcessingRequestDto = TaxPaymentRequestDto | TaxRefundRequestDto | TaxAdjustmentRequestDto;
