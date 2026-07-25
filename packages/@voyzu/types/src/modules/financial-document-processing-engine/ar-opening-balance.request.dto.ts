export interface ArOpeningBalanceCounterpartyInputDto {
  code?: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  state_or_province_code?: string | null;
}

export interface ArOpeningBalanceItemRequestDto {
  line_id?: number | null;
  external_reference?: string | null;
  description: string;
  original_invoice_date?: string | null;
  due_date?: string | null;
  amount: number | string;
}

export interface ArOpeningBalanceRequestDto {
  document_type?: "AR_OPENING_BALANCE";
  company_code?: string | null;
  ar_counterparty_code?: string | null;
  ar_counterparty?: ArOpeningBalanceCounterpartyInputDto | null;
  document_id?: string | null;
  memo?: string | null;
  opening_balance_date: string;
  posting_date?: string | null;
  opening_balance_equity_posting_code?: string | null;
  items: ArOpeningBalanceItemRequestDto[];
  dimensions?: Record<string, string> | null;
}
