import type { EntryType } from "@voyzu-modules/core/types/modules/core";
export interface ArCounterpartySummaryRow {
  counterparty_code: string;
  counterparty_name: string;
  open_invoices_amount: number;
  unapplied_receipts_amount: number;
  net_balance: number;
}

export interface ArCounterpartyStatementRow {
  entry_header_id: number;
  parent_entry_header_id: number | null;
  code: string;
  posting_date: string;
  document_type_code: string;
  document_type_label: string;
  document_id: string;
  memo: string | null;
  description: string;
  entry_type: EntryType;
  base_currency_amount: number;
  base_currency_code: string;
  counterparty_code: string;
  counterparty_name: string;
}
