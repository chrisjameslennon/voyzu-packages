export interface ApBillCounterpartyInputDto {
  code?: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  state_or_province_code?: string | null;
}

export type ApBillDimensionsDto = Record<string, string>;
export type ApBillAmountDto = number | string;

export interface ApBillCallerSuppliedTaxComponentDto {
  tax_authority_code: string;
  tax_rate: number;
  invoice_label?: string | null;
}

export interface ApBillLineRequestDto {
  line_id?: number | null;
  description: string;
  quantity?: ApBillAmountDto | null;
  net_amount?: ApBillAmountDto | null;
  gross_amount?: ApBillAmountDto | null;
  tax_rule: string;
  tax_components?: ApBillCallerSuppliedTaxComponentDto[] | null;
  tax_recoverable?: boolean | null;
  purchase_posting_code?: string | null;
  inventory_item_code?: string | null;
  dimensions?: ApBillDimensionsDto | null;
}

export interface ApBillRequestDto {
  document_type?: "AP_BILL";
  company_code?: string | null;
  ap_counterparty_code?: string | null;
  ap_counterparty?: ApBillCounterpartyInputDto | null;
  document_id?: string | null;
  supplier_invoice_number: string;
  memo?: string | null;
  bill_date: string;
  posting_date?: string | null;
  tax_recoverable?: boolean | null;
  purchase_posting_code?: string | null;
  dimensions?: ApBillDimensionsDto | null;
  lines: ApBillLineRequestDto[];
}
