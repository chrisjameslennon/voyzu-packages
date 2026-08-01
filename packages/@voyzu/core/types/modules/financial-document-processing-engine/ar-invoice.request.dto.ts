export interface ArInvoiceCounterpartyInputDto {
  code?: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  state_or_province_code?: string | null;
}

export type ArInvoiceDimensionsDto = Record<string, string>;

export interface ArInvoiceCallerSuppliedTaxComponentDto {
  tax_authority_code: string;
  tax_rate: number;
  invoice_label?: string | null;
}

export interface ArInvoiceLineRequestDto {
  line_id?: number | null;
  description: string;
  quantity?: number | null;
  net_unit_price?: number | null;
  net_line_total?: number | null;
  revenue_posting_code?: string | null;
  inventory_item_code?: string | null;
  tax_rule: string;
  tax_components?: ArInvoiceCallerSuppliedTaxComponentDto[] | null;
  dimensions?: ArInvoiceDimensionsDto | null;
}

export interface ArInvoiceRequestDto {
  document_type?: "AR_INVOICE";
  company_code?: string | null;
  ar_counterparty_code?: string | null;
  ar_counterparty?: ArInvoiceCounterpartyInputDto | null;
  document_id?: string | null;
  document_memo?: string | null;
  invoice_date: string;
  posting_date?: string | null;
  revenue_posting_code?: string | null;
  dimensions?: ArInvoiceDimensionsDto | null;
  lines: ArInvoiceLineRequestDto[];
}
